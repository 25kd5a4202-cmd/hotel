"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/pricing";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  Check,
  X,
  ChefHat,
  Bike,
  Package,
  Layers,
  Printer,
} from "lucide-react";

interface AdminDashboardProps {
  initialKPIs: any;
  initialOrders: any[];
  topSelling: any[];
  products: any[];
  categories: any[];
  currentAdmin: any;
}

export function AdminDashboardClient({
  initialKPIs,
  initialOrders,
  topSelling,
  products: initialProducts,
  categories,
  currentAdmin,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "menu" | "analytics">("orders");
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (orderId: string, nextStatus: string, notes?: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, notes }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: nextStatus });
        }
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch {
      alert("Network error updating order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleProduct = async (productId: string, currentVal: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !currentVal }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, isAvailable: !currentVal } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
            Kitchen Operating System
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            Bistro Management Console
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Logged in as {currentAdmin.name} ({currentAdmin.role})
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-stone-100 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === "orders" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600"
            }`}
          >
            Live Kitchen Orders
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === "menu" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600"
            }`}
          >
            Dishes & Stock ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === "analytics" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600"
            }`}
          >
            Top Dishes & Sales
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Today's Net Revenue
          </span>
          <p className="text-2xl sm:text-3xl font-black text-stone-900">
            {formatPrice(initialKPIs.todayRevenue)}
          </p>
          <span className="text-[11px] font-semibold text-emerald-600 block">
            Paid orders today
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Active Orders
          </span>
          <p className="text-2xl sm:text-3xl font-black text-orange-600">
            {initialKPIs.activeOrdersCount}
          </p>
          <span className="text-[11px] font-semibold text-stone-400 block">
            In kitchen or transit
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Pending Approval
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">
            {initialKPIs.pendingCount}
          </p>
          <span className="text-[11px] font-semibold text-stone-400 block">
            Requires kitchen acceptance
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Completed Today
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">
            {initialKPIs.completedToday}
          </p>
          <span className="text-[11px] font-semibold text-stone-400 block">
            Successfully delivered
          </span>
        </div>
      </div>

      {/* Tab: Orders */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order ref, customer, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
              {["ALL", "PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase whitespace-nowrap transition ${
                      statusFilter === st
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {st.replace(/_/g, " ")}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200/80 text-stone-500 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Order Ref</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/70 transition">
                        <td className="py-3.5 px-4 font-black text-stone-900">
                          #{ord.orderNumber}
                          <span className="block text-[10px] text-stone-400 font-normal">
                            {new Date(ord.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-stone-900 block">{ord.customerName}</span>
                          <span className="text-[11px] text-stone-500">{ord.customerPhone}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-stone-800">{ord.items.length} items</span>
                          <span className="block text-[11px] text-stone-400 truncate max-w-[150px]">
                            {ord.items.map((i: any) => i.productName).join(", ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-black text-stone-900">
                          {formatPrice(ord.grandTotal)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              ord.paymentStatus === "PAID"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.paymentMethod} • {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              ord.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.status === "CANCELLED"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {ord.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* State transitions */}
                            {ord.status === "PENDING" && (
                              <>
                                <button
                                  disabled={updatingId === ord.id}
                                  onClick={() => handleUpdateStatus(ord.id, "CONFIRMED")}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-2.5 py-1 rounded text-[11px] transition"
                                >
                                  Accept
                                </button>
                                <button
                                  disabled={updatingId === ord.id}
                                  onClick={() => handleUpdateStatus(ord.id, "CANCELLED")}
                                  className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-2 py-1 rounded text-[11px] transition"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {ord.status === "CONFIRMED" && (
                              <button
                                disabled={updatingId === ord.id}
                                onClick={() => handleUpdateStatus(ord.id, "PREPARING")}
                                className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-2.5 py-1 rounded text-[11px] transition"
                              >
                                Bake (Kitchen)
                              </button>
                            )}
                            {ord.status === "PREPARING" && (
                              <button
                                disabled={updatingId === ord.id}
                                onClick={() => handleUpdateStatus(ord.id, "OUT_FOR_DELIVERY")}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-2.5 py-1 rounded text-[11px] transition"
                              >
                                Dispatch
                              </button>
                            )}
                            {ord.status === "OUT_FOR_DELIVERY" && (
                              <button
                                disabled={updatingId === ord.id}
                                onClick={() => handleUpdateStatus(ord.id, "COMPLETED")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-2.5 py-1 rounded text-[11px] transition"
                              >
                                Complete
                              </button>
                            )}

                            {/* View Bill Modal */}
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded transition"
                              title="View Bill Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-stone-400">
                        No orders match your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Menu Management */}
      {activeTab === "menu" && (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
              Product Stock & Kitchen Availability
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              Toggle instant 86/Sold-Out status
            </span>
          </div>
          <div className="divide-y divide-stone-100">
            {products.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={p.isVeg ? "veg-badge" : "nonveg-badge"} />
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{p.name}</h4>
                    <p className="text-xs text-stone-400">
                      {p.category.name} • {formatPrice(p.basePrice)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleProduct(p.id, p.isAvailable)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                    p.isAvailable
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                  }`}
                >
                  {p.isAvailable ? "In Stock" : "Sold Out (86)"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Analytics & Top Dishes */}
      {activeTab === "analytics" && (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 space-y-4">
          <h3 className="font-extrabold text-base text-stone-900">
            Top Performing Dishes by Volume
          </h3>
          <div className="space-y-3">
            {topSelling.map((ts, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200/80"
              >
                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-orange-600">#{idx + 1}</span>
                  <div>
                    <span className="font-extrabold text-sm text-stone-900">
                      {ts.product?.name || "Dish"}
                    </span>
                    <span className="text-xs text-stone-500 block">
                      {ts.totalQuantity} portions prepared
                    </span>
                  </div>
                </div>
                <span className="font-black text-sm text-stone-900">
                  {formatPrice(ts.totalRevenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Bill Dialog Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-stone-900">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-stone-500">
                  {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <p>
                <strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerPhone})
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.customerEmail}
              </p>
              <p>
                <strong>Type:</strong> {selectedOrder.orderType}
              </p>
              {selectedOrder.notes && (
                <p className="text-orange-700 pt-1">
                  <strong>Notes:</strong> {selectedOrder.notes}
                </p>
              )}
            </div>

            <div className="space-y-2 divide-y divide-stone-100">
              {selectedOrder.items.map((i: any) => (
                <div key={i.id} className="pt-2 flex justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-stone-900">
                      {i.quantity}x {i.productName}
                    </span>
                    {i.variantName && (
                      <p className="text-stone-500 text-[11px]">{i.variantName}</p>
                    )}
                  </div>
                  <span className="font-black text-stone-900">{formatPrice(i.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-3 text-xs space-y-1 font-semibold text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{formatPrice(selectedOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>{formatPrice(selectedOrder.taxTotal)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-900 pt-1 border-t border-stone-200">
                <span>Grand Total</span>
                <span>{formatPrice(selectedOrder.grandTotal)}</span>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-stone-900 hover:bg-black text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
