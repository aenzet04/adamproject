# frozen_string_literal: true

module AuditEngine
  class FraudDetectorService
    attr_reader :tenant

    def self.inspect_event!(tenant:, audit_log:)
      new(tenant: tenant).inspect_event!(audit_log)
    end

    def initialize(tenant:)
      @tenant = tenant
    end

    def inspect_event!(audit_log)
      case audit_log.event_type
      when "void_order"
        check_excessive_voids(audit_log)
      when "pos_checkout"
        check_abnormal_discounts(audit_log)
      when "cash_drawer_open"
        check_unauthorized_drawer_access(audit_log)
      end
    end

    private

    # Rule 1: More than 3 voids in 15 minutes by the same cashier or branch
    def check_excessive_voids(audit_log)
      recent_voids_count = AuditLog.where(
        tenant_id: tenant.id,
        branch_id: audit_log.branch_id,
        event_type: "void_order",
        occurred_at: (audit_log.occurred_at - 15.minutes)..audit_log.occurred_at
      ).count

      if recent_voids_count >= 3
        audit_log.update!(
          flagged_fraud: true,
          fraud_reason: "High velocity VOID anomaly: #{recent_voids_count} voids within 15 minutes at this outlet"
        )
      end
    end

    # Rule 2: Manual discount exceeding 25% without manager override
    def check_abnormal_discounts(audit_log)
      payload = audit_log.payload_after || {}
      discount_amount = payload["discount_amount"].to_f
      subtotal = payload["subtotal_amount"].to_f

      if subtotal > 0 && (discount_amount / subtotal) > 0.25
        audit_log.update!(
          flagged_fraud: true,
          fraud_reason: "Excessive discount alert: #{((discount_amount / subtotal) * 100).round(1)}% discount applied"
        )
      end
    end

    # Rule 3: Drawer opened outside of active POS checkout
    def check_unauthorized_drawer_access(audit_log)
      audit_log.update!(
        flagged_fraud: true,
        fraud_reason: "Manual Cash Drawer trigger without active transaction"
      )
    end
  end
end
