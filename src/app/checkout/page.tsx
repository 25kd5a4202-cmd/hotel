"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/pricing";
import { ShieldCheck, ArrowRight, Lock, MapPin, Phone, User, Mail, CreditCard, Banknote } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, financials, coupon, isPickup, clearCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("Bangalore");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("560001");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <button
          onClick={() => router.push("/menu")}
          className="mt-4 text-orange-600 font-bold hover:underline"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const payload = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        orderType: isPickup ? "PICKUP" : "DELIVERY",
        deliveryAddress: isPickup
          ? undefined
          : { street, landmark, city, state, postalCode },
        paymentMethod,
        couponCode: coupon?.code,
        notes,
        idempotencyKey,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          selectedAddOnIds: i.selectedAddOns.map((a) => a.id),
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to place order");
      }

      const orderRef = data.order.orderNumber;

      // If payment is ONLINE, trigger mock/razorpay intent
      if (paymentMethod === "ONLINE") {
        const intentRes = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.order.id }),
        });
        const intent = await intentRes.json();

        // Simulate verification for demo/sandbox mode
        await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.order.id,
            razorpayOrderId: intent.razorpayOrderId,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpaySignature: "sandbox_verified_signature",
          }),
        });
      }

      clearCart();
      router.push(`/order/${orderRef}`);
    } catch (err: any) {
      setError(err.message || "An error occurred while placing your order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-stone-900">Secure Checkout</h1>
        <p className="text-stone-500 text-sm mt-1">
          Verify your delivery information and finalize your order.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Customer Details */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arjun Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arjun@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98333 44455"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address (only if not pickup) */}
          {!isPickup ? (
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">
                    Flat / House / Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Flat 402, Skyline Residency, 5th Cross"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Near Central Park"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl text-orange-950 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
              <div>
                <p className="text-sm font-bold">Self-Pickup at Restaurant</p>
                <p className="text-xs text-orange-800">
                  Collect from: 104 Gourmet Square, Tech Boulevard, Silicon District (Ready in 20-25 mins)
                </p>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-600" />
              Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  paymentMethod === "COD"
                    ? "border-orange-600 bg-orange-50/40 ring-1 ring-orange-600"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="sr-only"
                />
                <Banknote className="w-6 h-6 text-stone-700" />
                <div>
                  <span className="font-extrabold text-sm text-stone-900 block">
                    Cash on Delivery
                  </span>
                  <span className="text-xs text-stone-500">Pay cash/UPI upon delivery</span>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  paymentMethod === "ONLINE"
                    ? "border-orange-600 bg-orange-50/40 ring-1 ring-orange-600"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  className="sr-only"
                />
                <CreditCard className="w-6 h-6 text-stone-700" />
                <div>
                  <span className="font-extrabold text-sm text-stone-900 block">
                    Online Payment / Razorpay
                  </span>
                  <span className="text-xs text-stone-500">UPI, Cards & Netbanking</span>
                </div>
              </label>
            </div>
          </div>

          {/* Kitchen Instructions */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
            <label className="text-xs font-bold text-stone-700 block">
              Special Cooking Instructions / Delivery Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please leave at the door, extra napkins, less spicy..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Order Review Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-stone-900 border-b border-stone-100 pb-3">
            Order Summary ({items.length} dishes)
          </h3>

          <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 space-y-2 pr-1">
            {items.map((i) => (
              <div key={i.id} className="pt-2 flex justify-between items-start text-xs">
                <div>
                  <span className="font-extrabold text-stone-900">
                    {i.quantity}x {i.name}
                  </span>
                  {i.variantName && <p className="text-stone-500">{i.variantName}</p>}
                </div>
                <span className="font-bold text-stone-800">
                  {formatPrice(i.unitPrice * i.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-3 space-y-2 text-xs text-stone-600 font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">{formatPrice(financials.subtotal)}</span>
            </div>
            {financials.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coupon ({coupon?.code})</span>
                <span>-{formatPrice(financials.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold text-stone-900">
                {financials.deliveryFee === 0 ? "FREE" : formatPrice(financials.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5% GST)</span>
              <span className="font-bold text-stone-900">{formatPrice(financials.taxTotal)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-stone-900 border-t border-stone-200 pt-2">
              <span>Grand Total</span>
              <span>{formatPrice(financials.grandTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? "Placing Order..." : `Pay ${formatPrice(financials.grandTotal)}`}</span>
          </button>

          <p className="text-[11px] text-center text-stone-400 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Encrypted & Secure Checkout
          </p>
        </div>
      </form>
    </div>
  );
}
