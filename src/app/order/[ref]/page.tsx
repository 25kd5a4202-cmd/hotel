"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/pricing";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  CheckCheck,
  AlertCircle,
  Printer,
  ArrowLeft,
  MapPin,
  RefreshCw,
} from "lucide-react";

const STEPS = [
  { key: "PENDING", label: "Order Placed", icon: CheckCircle2 },
  { key: "CONFIRMED", label: "Accepted", icon: Clock },
  { key: "PREPARING", label: "In Kitchen", icon: ChefHat },
  { key: "OUT_FOR_DELIVERY", label: "On The Way", icon: Bike },
  { key: "COMPLETED", label: "Delivered", icon: CheckCheck },
];

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${ref}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // 10s live poll
    return () => clearInterval(interval);
  }, [ref]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-600" />
        <p className="text-stone-500 font-bold text-sm">Fetching live order status...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-stone-900">Order Not Found</h2>
        <p className="text-stone-500 text-sm">
          We couldn't locate an active order matching reference "{ref}".
        </p>
        <Link
          href="/menu"
          className="inline-block bg-orange-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";

  let addressObj = null;
  if (order.deliveryAddress) {
    try {
      addressObj = JSON.parse(order.deliveryAddress);
    } catch {}
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              Order #{order.orderNumber}
            </h1>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                order.status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-800"
                  : order.status === "CANCELLED"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Placed on {new Date(order.createdAt).toLocaleString("en-IN")} • {order.orderType}
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <Link
            href="/menu"
            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Order More</span>
          </Link>
        </div>
      </div>

      {/* Visual Status Timeline */}
      {!isCancelled ? (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-xs">
          <h2 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider mb-6">
            Live Preparation Progress
          </h2>

          <div className="grid grid-cols-5 gap-2 relative">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                      isPassed
                        ? "bg-orange-600 text-white"
                        : "bg-stone-100 text-stone-400 border border-stone-200"
                    } ${isCurrent ? "ring-4 ring-orange-200 animate-pulse" : ""}`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-extrabold mt-2 leading-tight ${
                      isPassed ? "text-stone-900" : "text-stone-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-rose-900 space-y-2">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            This order has been cancelled
          </h3>
          <p className="text-xs text-rose-700">
            If payment was deducted online, a refund will be processed back to your original source within 3-5 business days.
          </p>
        </div>
      )}

      {/* Order Item Snapshot & Bill */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Receipt items */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-stone-900 border-b border-stone-100 pb-3">
            Itemized Bill Snapshot
          </h3>

          <div className="divide-y divide-stone-100">
            {order.items.map((item: any) => {
              let addOns = [];
              try {
                addOns = JSON.parse(item.selectedAddOns || "[]");
              } catch {}

              return (
                <div key={item.id} className="py-3 flex justify-between items-start text-xs">
                  <div>
                    <span className="font-extrabold text-stone-900 text-sm">
                      {item.quantity}x {item.productName}
                    </span>
                    {item.variantName && (
                      <p className="text-orange-600 font-semibold">{item.variantName}</p>
                    )}
                    {addOns.length > 0 && (
                      <p className="text-stone-500 mt-0.5">
                        + {addOns.map((a: any) => a.name).join(", ")}
                      </p>
                    )}
                  </div>
                  <span className="font-black text-stone-900 text-sm">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-stone-600 font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount ({order.couponCode})</span>
                <span>-{formatPrice(order.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="font-bold text-stone-900">
                {order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST & Taxes (5%)</span>
              <span className="font-bold text-stone-900">{formatPrice(order.taxTotal)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-stone-900 border-t border-stone-200 pt-2">
              <span>Total Amount</span>
              <span>{formatPrice(order.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment Info */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
              Customer & Delivery
            </h3>
            <div className="text-xs space-y-2 text-stone-600">
              <p>
                <strong className="text-stone-900">Name:</strong> {order.customerName}
              </p>
              <p>
                <strong className="text-stone-900">Phone:</strong> {order.customerPhone}
              </p>
              <p>
                <strong className="text-stone-900">Email:</strong> {order.customerEmail}
              </p>
              {addressObj && (
                <div className="pt-2 border-t border-stone-100 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>
                    {addressObj.street}, {addressObj.city}, {addressObj.postalCode}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
              Payment Status
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600">Payment Mode</span>
              <span className="font-extrabold text-stone-900">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600">Status</span>
              <span
                className={`font-black uppercase px-2 py-0.5 rounded text-[11px] ${
                  order.paymentStatus === "PAID"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
