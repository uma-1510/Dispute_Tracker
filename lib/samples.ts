export interface SampleDispute {
  id: string;
  label: string;
  icon: string;
  email: string;
}

export const SAMPLE_DISPUTES: SampleDispute[] = [
  {
    id: "duplicate",
    label: "Duplicate charge",
    icon: "🔄",
    email: `Subject: Duplicate Invoice Charge - Please Review

Dear Accounts Receivable Team,

I'm reaching out regarding what appears to be a duplicate charge on our account. We were billed twice for the same delivery.

Invoice #8821 and Invoice #8834 both show a charge of $12,400 for the same March 14, 2024 Chicago delivery. We only received one shipment, so we should only be billed once.

Could you please investigate and issue a credit memo for the duplicate charge? We'd like this resolved before our next payment cycle.

Thank you,
Sarah Chen
Accounts Payable, Meridian Logistics`,
  },
  {
    id: "pricing",
    label: "Pricing dispute",
    icon: "💰",
    email: `Subject: Pricing Discrepancy on Invoice #4492

Hello,

I'm writing about a pricing discrepancy we found on a recent invoice. Invoice #4492 shows a charge of $8,750, but our signed contract rate for this lane is $7,200.

This looks like an overcharge of $1,550. Can you confirm the correct rate and adjust the invoice accordingly? We'd like to avoid a short-pay situation if possible, but we cannot pay the full amount as billed until this is corrected.

Please let us know the next steps.

Best regards,
Marcus Webb
Apex Distribution`,
  },
  {
    id: "not-received",
    label: "Goods not received",
    icon: "📦",
    email: `Subject: Invoice #9103 - Shipment Not Received

Hi team,

We received Invoice #9103 for $31,000, but the shipment associated with this invoice was never received at our facility. Our warehouse has no record of delivery, and there is no signed proof of delivery on file.

We cannot process payment for goods not received. Please provide tracking information or proof of delivery, or issue a credit for this invoice.

Thanks,
James Okafor
Northern Industrial`,
  },
  {
    id: "short-pay",
    label: "SLA short-pay",
    icon: "✂️",
    email: `Subject: Short-Pay Notice - Invoice #7710

Dear Billing Department,

Per Section 4.2 of our service agreement, deliveries that are more than 5 days late are subject to a penalty deduction. The shipment under Invoice #7710 arrived 11 days late, so we are short-paying this invoice.

We are remitting $19,800 instead of the full $22,000 billed, in accordance with the SLA penalty terms outlined in our contract. The deduction reflects the agreed late-delivery discrepancy.

Please update your records accordingly.

Regards,
Linda Park
Global Freight Co`,
  },
];
