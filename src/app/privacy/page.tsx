import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <h1 className="text-3xl font-black text-stone-900">Privacy Policy</h1>
      <p className="text-xs text-stone-400">Last updated: October 2026</p>
      <div className="prose prose-stone text-sm text-stone-600 space-y-4 leading-relaxed">
        <p>
          At Antigravity Bistro & Kitchen, we are committed to safeguarding the personal information you share with us when browsing our menu, creating an account, and placing food delivery orders.
        </p>
        <h2 className="text-lg font-bold text-stone-900 pt-2">1. Information We Collect</h2>
        <p>
          We collect essential customer information necessary to prepare and deliver your orders accurately: your name, contact phone number, delivery address, email address, and order customizations.
        </p>
        <h2 className="text-lg font-bold text-stone-900 pt-2">2. Payment Security</h2>
        <p>
          We do not store your raw credit/debit card numbers or UPI PINs. All online payments are securely processed through industry-standard payment providers (e.g., Razorpay) adhering to PCI-DSS compliance.
        </p>
        <h2 className="text-lg font-bold text-stone-900 pt-2">3. Contact Us</h2>
        <p>
          For privacy inquiries or deletion requests, email us at orders@antigravitybistro.com.
        </p>
      </div>
    </div>
  );
}
