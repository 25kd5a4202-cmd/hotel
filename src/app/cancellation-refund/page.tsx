import React from "react";

export default function CancellationRefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <h1 className="text-3xl font-black text-stone-900">Cancellation & Refund Policy</h1>
      <p className="text-xs text-stone-400">Effective Date: October 2026</p>
      <div className="text-sm text-stone-600 space-y-4 leading-relaxed">
        <h2 className="text-lg font-bold text-stone-900">1. Order Cancellations</h2>
        <p>
          Because our dough and dishes are prepared fresh to order, cancellations can only be accepted while the order is in the <strong>PENDING</strong> state prior to kitchen confirmation. Once the order transitions to <strong>PREPARING</strong>, cancellation is no longer possible.
        </p>
        <h2 className="text-lg font-bold text-stone-900 pt-2">2. Refunds for Online Payments</h2>
        <p>
          If your order is rejected by the kitchen or cancelled within the eligible timeframe, your online payment will be refunded to your original payment method within 3 to 5 business days.
        </p>
        <h2 className="text-lg font-bold text-stone-900 pt-2">3. Quality Assurance & Issues</h2>
        <p>
          If your delivery arrives damaged or is missing an item, please notify our support team immediately at +91 98765 43210 within 30 minutes of delivery with your Order Reference Number.
        </p>
      </div>
    </div>
  );
}
