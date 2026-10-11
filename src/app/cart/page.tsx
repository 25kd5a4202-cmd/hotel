"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/pricing";
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Bike, Store, Check, X } from "lucide-react";

export default function CartPage() {
  const {
    items,
    itemCount,
    financials,
    coupon,
    isPickup,
    setIsPickup,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal: financials.subtotal }),
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponError(data.error || "Invalid coupon code");
      } else {
        applyCoupon(data.coupon);
        setCouponInput("");
      }
    } catch {
      setCouponError("Network error while validating coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-stone-900">Your Cart is Empty</h2>
        <p className="text-stone-500 text-sm max-w-sm mx-auto">
          Explore our menu and add authentic stone-hearth pizzas and gourmet dishes to your bag.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition"
        >
          <span>Explore Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-stone-900">Your Gourmet Bag</h1>
        <p className="text-stone-500 text-sm mt-1">{itemCount} items ready for preparation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Delivery Mode Toggle */}
          <div className="bg-white p-3 rounded-2xl border border-stone-200/90 flex gap-2">
            <button
              onClick={() => setIsPickup(false)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
                !isPickup
                  ? "bg-orange-600 text-white shadow-xs"
                  : "bg-stone-50 text-stone-700 hover:bg-stone-100"
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Doorstep Delivery</span>
            </button>
            <button
              onClick={() => setIsPickup(true)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
                isPickup
                  ? "bg-orange-600 text-white shadow-xs"
                  : "bg-stone-50 text-stone-700 hover:bg-stone-100"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Self Pickup</span>
            </button>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-stone-200/90 divide-y divide-stone-100 overflow-hidden shadow-xs">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex gap-4 items-center">
                {/* Thumb */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-stone-400">
                      AG
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={item.isVeg ? "veg-badge" : "nonveg-badge"} />
                    <h3 className="font-extrabold text-stone-900 text-sm sm:text-base truncate">
                      {item.name}
                    </h3>
                  </div>

                  {item.variantName && (
                    <p className="text-xs text-orange-600 font-bold mt-0.5">
                      Portion: {item.variantName}
                    </p>
                  )}

                  {item.selectedAddOns.length > 0 && (
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      + {item.selectedAddOns.map((a) => a.name).join(", ")}
                    </p>
                  )}

                  <p className="text-xs font-black text-stone-800 mt-1">
                    {formatPrice(item.unitPrice)}
                  </p>
                </div>

                {/* Counter & Delete */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50 font-black">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 py-1 text-stone-600 hover:bg-stone-200 text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-stone-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 py-1 text-stone-600 hover:bg-stone-200 text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-stone-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Bill Summary */}
        <div className="lg:col-span-4 space-y-4">
          {/* Coupon Code Block */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-orange-600" />
              Apply Discount Coupon
            </h3>

            {coupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-black">{coupon.code} Applied</p>
                    <p className="text-[11px] text-emerald-700">
                      Saved {formatPrice(coupon.discountAmount)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 rounded-full text-emerald-700 hover:bg-emerald-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. WELCOME50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 border border-stone-200 rounded-xl text-xs font-bold uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
                {couponError && <p className="text-xs text-rose-600 font-medium">{couponError}</p>}
              </form>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-stone-900 border-b border-stone-100 pb-2">
              Bill Details
            </h3>

            <div className="space-y-2 text-xs text-stone-600 font-medium">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-bold text-stone-900">
                  {formatPrice(financials.subtotal)}
                </span>
              </div>

              {financials.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(financials.discountTotal)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-stone-900">
                  {financials.deliveryFee === 0 ? "FREE" : formatPrice(financials.deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Taxes & Restaurant GST (5%)</span>
                <span className="font-bold text-stone-900">
                  {formatPrice(financials.taxTotal)}
                </span>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-3 flex justify-between items-center">
              <div>
                <span className="text-xs text-stone-400 font-medium block">Total Payable</span>
                <span className="text-xl font-black text-stone-900">
                  {formatPrice(financials.grandTotal)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-extrabold text-sm py-3 px-6 rounded-xl shadow-md shadow-orange-600/30 flex items-center gap-2 transition"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
