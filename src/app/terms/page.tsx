import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <h1 className="text-3xl font-black text-stone-900">Terms of Service</h1>
      <p className="text-xs text-stone-400">Last updated: October 2026</p>
      <div className="text-sm text-stone-600 space-y-4 leading-relaxed">
        <p>
          Welcome to Antigravity Bistro & Kitchen. By placing an order through our digital platform, you agree to comply with and be bound by the following terms.
        </p>
        <h2 className="text-lg font-bold text-stone-900 pt-2">1. Ordering & Acceptance</h2>
        <p>
          All orders placed through this website are subject to availability and kitchen capacity. The restaurant reserves the right to decline or cancel orders in cases of extreme inclement weather or delivery constraints outside our radius.
        </p>
        <h2 className="text-lg font-bold text-stone-900 pt-2">2. Pricing & Taxes</h2>
        <p>
          All prices are quoted in Indian Rupees (INR) and are subject to applicable Goods and Services Tax (GST 5%) and standard delivery charges.
        </p>
      </div>
    </div>
  );
}
