# frozen_string_literal: true

require "bigdecimal"

module HrEngine
  class PayrollProcessorService
    attr_reader :tenant, :brand, :branch, :period_month, :period_year, :processed_by

    def initialize(tenant:, brand:, branch: nil, period_month:, period_year:, processed_by:)
      @tenant = tenant
      @brand = brand
      @branch = branch
      @period_month = period_month
      @period_year = period_year
      @processed_by = processed_by
    end

    def calculate_employee_payroll(employee)
      base_salary = BigDecimal(employee[:base_salary].to_s)
      allowances = BigDecimal(employee[:allowances].to_s || "0.0")
      overtime_hours = BigDecimal(employee[:overtime_hours].to_s || "0.0")
      loan_deduction = BigDecimal(employee[:loan_deduction].to_s || "0.0")

      # 1. Overtime Calculation (Depnaker Standard: 1/173 x Base Salary)
      hourly_rate = (base_salary / BigDecimal("173.0")).round(2)
      overtime_pay = if overtime_hours > 0
                       # 1st hour: 1.5x, subsequent hours: 2.0x
                       first_hour = [overtime_hours, BigDecimal("1.0")].min * hourly_rate * BigDecimal("1.5")
                       remaining_hours = [overtime_hours - BigDecimal("1.0"), BigDecimal("0.0")].max * hourly_rate * BigDecimal("2.0")
                       (first_hour + remaining_hours).round(2)
                     else
                       BigDecimal("0.0")
                     end

      gross_income = base_salary + allowances + overtime_pay

      # 2. BPJS Calculations (Indonesian Standard)
      # Employee portion: JHT (2%) + JP (1%) + BPJS Kesehatan (1%) = 4%
      bpjs_ketenagakerjaan_emp = (base_salary * BigDecimal("0.03")).round(2)
      bpjs_kesehatan_emp = (base_salary * BigDecimal("0.01")).round(2)
      total_bpjs_deduction = bpjs_ketenagakerjaan_emp + bpjs_kesehatan_emp

      # 3. PPh 21 TER (Tarif Efektif Rata-rata)
      pph21_rate = determine_pph21_ter_rate(gross_income, employee[:ptkp_status] || "TK/0")
      pph21_tax = (gross_income * pph21_rate).round(2)

      # 4. Net Take-Home Pay (THP)
      net_salary = gross_income - total_bpjs_deduction - pph21_tax - loan_deduction

      {
        employee_id: employee[:id],
        employee_name: employee[:name],
        base_salary: base_salary,
        allowances: allowances,
        overtime_pay: overtime_pay,
        gross_income: gross_income,
        bpjs_deduction: total_bpjs_deduction,
        pph21_tax: pph21_tax,
        loan_deduction: loan_deduction,
        net_salary: net_salary
      }
    end

    # Auto-post payroll journal entry to General Ledger
    def post_payroll_journal!(payroll_results)
      ActiveRecord::Base.transaction do
        total_gross = payroll_results.sum { |r| r[:gross_income] }
        total_pph21 = payroll_results.sum { |r| r[:pph21_tax] }
        total_bpjs = payroll_results.sum { |r| r[:bpjs_deduction] }
        total_loan = payroll_results.sum { |r| r[:loan_deduction] }
        total_net_payable = payroll_results.sum { |r| r[:net_salary] }

        entry_number = "JRN-PAYROLL-#{period_year}#{format('%02d', period_month)}"

        journal_entry = JournalEntry.create!(
          tenant_id: tenant.id,
          brand_id: brand.id,
          branch_id: branch&.id,
          entry_number: entry_number,
          entry_date: Date.new(period_year, period_month, -1),
          source_type: "PayrollRun",
          source_id: SecureRandom.uuid,
          narration: "Auto-posting Beban Gaji & Payroll Periode #{period_month}/#{period_year}",
          total_debit: total_gross,
          total_credit: total_gross,
          status: "posted",
          posted_by_id: processed_by&.id
        )

        # Debit: Beban Gaji & Upah (Gross)
        salary_expense_acc = ChartOfAccount.find_by!(tenant_id: tenant.id, category: "salary_expense")
        journal_entry.journal_entry_lines.create!(
          tenant_id: tenant.id,
          chart_of_account_id: salary_expense_acc.id,
          debit: total_gross,
          credit: 0.0,
          description: "Beban Gaji Karyawan Periode #{period_month}/#{period_year}"
        )

        # Credit: Hutang PPh 21 Karyawan
        if total_pph21 > 0
          pph21_payable_acc = ChartOfAccount.find_by!(tenant_id: tenant.id, category: "pph21_payable")
          journal_entry.journal_entry_lines.create!(
            tenant_id: tenant.id,
            chart_of_account_id: pph21_payable_acc.id,
            debit: 0.0,
            credit: total_pph21,
            description: "Potongan Hutang PPh 21 Karyawan"
          )
        end

        # Credit: Hutang BPJS
        if total_bpjs > 0
          bpjs_payable_acc = ChartOfAccount.find_by!(tenant_id: tenant.id, category: "bpjs_payable")
          journal_entry.journal_entry_lines.create!(
            tenant_id: tenant.id,
            chart_of_account_id: bpjs_payable_acc.id,
            debit: 0.0,
            credit: total_bpjs,
            description: "Potongan Hutang Iuran BPJS"
          )
        end

        # Credit: Kas / Bank (Gaji Bersih Yang Dibayarkan)
        bank_acc = ChartOfAccount.find_by!(tenant_id: tenant.id, category: "cash_bank")
        journal_entry.journal_entry_lines.create!(
          tenant_id: tenant.id,
          chart_of_account_id: bank_acc.id,
          debit: 0.0,
          credit: total_net_payable + total_loan,
          description: "Pengeluaran Kas/Bank untuk Pembayaran Gaji Karyawan"
        )

        journal_entry
      end
    end

    private

    def determine_pph21_ter_rate(gross, _ptkp)
      case gross
      when 0..5_400_000 then BigDecimal("0.0")
      when 5_400_001..5_650_000 then BigDecimal("0.0025")
      when 5_650_001..5_950_000 then BigDecimal("0.005")
      when 5_950_001..6_300_000 then BigDecimal("0.0075")
      when 6_300_001..6_750_000 then BigDecimal("0.010")
      when 6_750_001..7_500_000 then BigDecimal("0.015")
      when 7_500_001..8_550_000 then BigDecimal("0.020")
      when 8_550_001..9_650_000 then BigDecimal("0.030")
      else BigDecimal("0.050")
      end
    end
  end
end
