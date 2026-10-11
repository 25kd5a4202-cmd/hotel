import React from "react";
import prisma from "@/lib/db";
import { formatPrice } from "@/lib/pricing";
import { Tag, Sparkles, Copy, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export default async function OffersPage() {
  const coupons = await prisma.coupon.findMany({
    where: { isActive: true },
    orderBy: { discountValue: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
          Exclusive Discounts
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900">
          Gourmet Offers & Coupons
        </h1>
        <p className="text-stone-500 text-sm">
          Apply any of these verified promo codes at checkout for instant savings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl p-6 border-2 border-dashed border-orange-200 hover:border-orange-500 hover:shadow-xl transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-stone-900 tracking-tight">{c.code}</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                {c.description || "Special limited time discount"}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 space-y-1 font-medium">
              <p>Min order: {formatPrice(c.minOrderAmount)}</p>
              {c.maxDiscount && <p>Max saving: {formatPrice(c.maxDiscount)}</p>}
              <p>Valid till: {new Date(c.validUntil).toLocaleDateString("en-IN")}</p>
            </div>

            <Link
              href="/menu"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl text-center shadow-xs transition"
            >
              Order & Apply
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
