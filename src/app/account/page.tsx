import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { formatPrice } from "@/lib/pricing";
import { User, MapPin, Clock, ArrowRight, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
        take: 20,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-900">{user.name}</h1>
            <p className="text-xs sm:text-sm text-stone-500">{user.email} • {user.phone || "No phone added"}</p>
            <span className="inline-block mt-1 text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              {user.role} Member
            </span>
          </div>
        </div>

        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            Access Admin Dashboard
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Order History */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              Order History ({user.orders.length})
            </h2>
            <Link href="/menu" className="text-xs font-bold text-orange-600 hover:underline">
              Order Again
            </Link>
          </div>

          {user.orders.length > 0 ? (
            <div className="divide-y divide-stone-100 space-y-3">
              {user.orders.map((ord) => (
                <div key={ord.id} className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-stone-900">
                        #{ord.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          ord.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.status === "CANCELLED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {ord.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      • {ord.items.length} items • {formatPrice(ord.grandTotal)}
                    </p>
                  </div>

                  <Link
                    href={`/order/${ord.orderNumber}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg transition shrink-0"
                  >
                    <span>Track / Receipt</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-stone-400 text-sm">
              No orders placed yet. Try our wood-fired burrata margherita!
            </div>
          )}
        </div>

        {/* Saved Addresses */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
            <MapPin className="w-4 h-4 text-orange-600" />
            Saved Delivery Addresses
          </h2>

          {user.addresses.length > 0 ? (
            <div className="space-y-3">
              {user.addresses.map((addr) => (
                <div key={addr.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-stone-900 uppercase tracking-wider">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-stone-600 leading-snug">{addr.street}</p>
                  <p className="text-stone-500">{addr.city}, {addr.state} - {addr.postalCode}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400">No saved addresses yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
