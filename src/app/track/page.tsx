"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, ShieldCheck } from "lucide-react";

export default function TrackSearchPage() {
  const router = useRouter();
  const [orderRef, setOrderRef] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderRef.trim()) return;
    router.push(`/order/${orderRef.trim()}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <div className="bg-white p-8 rounded-3xl border border-stone-200/90 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
          <Search className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-stone-900">Track Your Order</h1>
          <p className="text-stone-500 text-sm mt-1">
            Enter your order reference number (e.g. ORD-2026-88101) to view real-time status.
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Enter Order Reference Number"
            value={orderRef}
            onChange={(e) => setOrderRef(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-stone-200 text-sm text-center font-bold tracking-wider uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 transition"
          >
            <span>Check Live Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-stone-400 font-medium">
          Need help? Call our support desk at +91 98765 43210
        </p>
      </div>
    </div>
  );
}
