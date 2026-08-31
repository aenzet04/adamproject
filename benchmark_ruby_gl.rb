require 'benchmark'
require 'bigdecimal'
require 'securerandom'

puts '==============================================================='
puts '⚡ BENCHMARK 2: RUBY DOUBLE-ENTRY POSTING & COGS ENGINE'
puts '==============================================================='

# Simulating 5,000 POS Order Auto-Posting calculations
N = 5_000
orders = Array.new(N) do |i|
  subtotal = BigDecimal((rand(50_000..500_000)).to_s)
  discount = BigDecimal((rand(0..20_000)).to_s)
  net_base = subtotal - discount
  tax = (net_base * BigDecimal("0.11")).round(2)
  service = (net_base * BigDecimal("0.05")).round(2)
  grand_total = net_base + tax + service
  cogs = (subtotal * BigDecimal("0.38")).round(2) # 38% HPP

  {
    order_number: "ORD-#{20260901}-#{i}",
    subtotal: subtotal,
    discount: discount,
    tax: tax,
    service: service,
    grand_total: grand_total,
    cogs: cogs
  }
end

time = Benchmark.measure do
  orders.each do |order|
    lines = []
    # 1. Debit Cash/Bank
    lines << { account: "1101-01", debit: order[:grand_total], credit: BigDecimal("0.0") }
    # 2. Credit Sales Revenue
    lines << { account: "4101-01", debit: BigDecimal("0.0"), credit: order[:subtotal] }
    # 3. Debit Discount if any
    if order[:discount] > 0
      lines << { account: "4102-01", debit: order[:discount], credit: BigDecimal("0.0") }
    end
    # 4. Credit Tax Payable
    lines << { account: "2103-01", debit: BigDecimal("0.0"), credit: order[:tax] }
    # 5. Credit Service Revenue
    lines << { account: "4201-01", debit: BigDecimal("0.0"), credit: order[:service] }
    # 6. Debit COGS
    lines << { account: "5101-01", debit: order[:cogs], credit: BigDecimal("0.0") }
    # 7. Credit Inventory Asset
    lines << { account: "1104-01", debit: BigDecimal("0.0"), credit: order[:cogs] }

    # Strict Invariant Verification
    tot_debit = lines.sum { |l| l[:debit] }
    tot_credit = lines.sum { |l| l[:credit] }
    raise "Out of balance" if (tot_debit - tot_credit).abs > BigDecimal("0.001")
  end
end

puts "✅ [GL Posting Throughput]: 5,000 Double-Entry Journals verified & posted in #{time.real.round(3)} seconds"
puts "✅ [Average Latency per Journal]: #{(time.real / N * 1000).round(4)} ms/transaction"
puts "✅ [Engine Throughput]: #{(N / time.real).round(0)} posted transactions / second"
