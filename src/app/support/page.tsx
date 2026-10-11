import React from "react";
import { Phone, Mail, Clock, HelpCircle } from "lucide-react";

export default function SupportPage() {
  const faqs = [
    {
      q: "What is your delivery radius?",
      a: "We currently deliver within a 15 km radius of our Silicon District bistro. Delivery is free on all orders over ₹500.",
    },
    {
      q: "How long does delivery take?",
      a: "Average preparation and delivery time is 30 to 40 minutes depending on your distance and current oven load.",
    },
    {
      q: "Can I customize pizza crusts and add-ons?",
      a: "Yes! Every pizza and burger can be personalized with portion sizes, stuffed crusts, and extra gourmet toppings in the customize modal.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery (COD) as well as online payments including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Netbanking via Razorpay.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
          Support Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900">How Can We Help?</h1>
        <p className="text-stone-500 text-sm">
          Find answers to frequently asked questions or reach out to our guest support desk.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2">
          <Phone className="w-6 h-6 text-orange-600 mx-auto" />
          <h3 className="font-bold text-sm text-stone-900">Phone Support</h3>
          <p className="text-xs text-stone-500">+91 98765 43210</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2">
          <Mail className="w-6 h-6 text-orange-600 mx-auto" />
          <h3 className="font-bold text-sm text-stone-900">Email Desk</h3>
          <p className="text-xs text-stone-500">orders@antigravitybistro.com</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2">
          <Clock className="w-6 h-6 text-orange-600 mx-auto" />
          <h3 className="font-bold text-sm text-stone-900">Operating Hours</h3>
          <p className="text-xs text-stone-500">10:00 AM – 11:00 PM</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-orange-600" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 divide-y divide-stone-100">
          {faqs.map((f, i) => (
            <div key={i} className="pt-4 space-y-1">
              <h3 className="font-bold text-sm text-stone-900">{f.q}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
