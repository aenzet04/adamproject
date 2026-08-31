# frozen_string_literal: true

require "bigdecimal"

module FinanceEngine
  class FinancialReportService
    attr_reader :tenant, :brand, :branch

    def initialize(tenant:, brand: nil, branch: nil)
      @tenant = tenant
      @brand = brand
      @branch = branch
    end

    # =========================================================================
    # 1. LABA RUGI (PROFIT & LOSS MULTI-BRAND / MULTI-BRANCH)
    # =========================================================================
    def profit_and_loss(start_date:, end_date:)
      lines = scoped_journal_lines
              .joins(:journal_entry, :chart_of_account)
              .where(journal_entries: { entry_date: start_date..end_date, status: "posted" })

      # Revenue (Credit - Debit)
      revenue_lines = lines.where(chart_of_accounts: { account_type: "revenue" })
      revenues = aggregate_by_account(revenue_lines, normal_balance: :credit)
      total_revenue = revenues.sum { |r| r[:amount] }

      # Cost of Goods Sold (Debit - Credit)
      cogs_lines = lines.where(chart_of_accounts: { category: "cost_of_goods_sold" })
      cogs = aggregate_by_account(cogs_lines, normal_balance: :debit)
      total_cogs = cogs.sum { |c| c[:amount] }

      gross_profit = total_revenue - total_cogs

      # Operating & Other Expenses (Debit - Credit)
      expense_lines = lines.where(chart_of_accounts: { account_type: "expense" })
                           .where.not(chart_of_accounts: { category: "cost_of_goods_sold" })
      operating_expenses = aggregate_by_account(expense_lines, normal_balance: :debit)
      total_operating_expense = operating_expenses.sum { |e| e[:amount] }

      net_income = gross_profit - total_operating_expense

      {
        period_start: start_date,
        period_end: end_date,
        revenues: revenues,
        total_revenue: total_revenue,
        cogs: cogs,
        total_cogs: total_cogs,
        gross_profit: gross_profit,
        operating_expenses: operating_expenses,
        total_operating_expense: total_operating_expense,
        net_income: net_income
      }
    end

    # =========================================================================
    # 2. NERACA KEUANGAN (BALANCE SHEET)
    # =========================================================================
    def balance_sheet(as_of_date: Date.current)
      lines = scoped_journal_lines
              .joins(:journal_entry, :chart_of_account)
              .where("journal_entries.entry_date <= ?", as_of_date)
              .where(journal_entries: { status: "posted" })

      # Assets (Debit - Credit)
      assets = aggregate_by_account(
        lines.where(chart_of_accounts: { account_type: "asset" }),
        normal_balance: :debit
      )
      total_assets = assets.sum { |a| a[:amount] }

      # Liabilities (Credit - Debit)
      liabilities = aggregate_by_account(
        lines.where(chart_of_accounts: { account_type: "liability" }),
        normal_balance: :credit
      )
      total_liabilities = liabilities.sum { |l| l[:amount] }

      # Equity (Credit - Debit)
      equity = aggregate_by_account(
        lines.where(chart_of_accounts: { account_type: "equity" }),
        normal_balance: :credit
      )
      total_equity = equity.sum { |e| e[:amount] }

      {
        as_of_date: as_of_date,
        assets: assets,
        total_assets: total_assets,
        liabilities: liabilities,
        total_liabilities: total_liabilities,
        equity: equity,
        total_equity: total_equity,
        is_balanced: (total_assets - (total_liabilities + total_equity)).abs < 0.01
      }
    end

    private

    def scoped_journal_lines
      scope = JournalEntryLine.where(tenant_id: tenant.id)
      scope = scope.joins(:journal_entry).where(journal_entries: { brand_id: brand.id }) if brand
      scope = scope.joins(:journal_entry).where(journal_entries: { branch_id: branch.id }) if branch
      scope
    end

    def aggregate_by_account(query_scope, normal_balance: :debit)
      grouped = query_scope.group("chart_of_accounts.account_code", "chart_of_accounts.account_name")
                           .sum("journal_entry_lines.debit - journal_entry_lines.credit")

      grouped.map do |(code, name), net_debit|
        amount = normal_balance == :debit ? net_debit : -net_debit
        {
          account_code: code,
          account_name: name,
          amount: amount.to_f
        }
      end.reject { |item| item[:amount].zero? }
    end
  end
end
