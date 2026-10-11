import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getFeaturedDishes } from "@/services/menu";
import { ProductCard } from "@/components/ProductCard";
import {
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Search,
  Star,
  Quote,
} from "lucide-react";
import prisma from "@/lib/db";

export const revalidate = 60; // revalidate every 60s

export default async function HomePage() {
  const [categories, featuredDishes, reviews] = await Promise.all([
    getCategories(),
    getFeaturedDishes(),
    prisma.review.findMany({
      where: { isApproved: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-stone-50 to-[#faf8f5] pt-12 pb-20 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-orange-100/80 border border-orange-200/80 text-orange-900 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                <Flame className="w-4 h-4 text-orange-600 fill-orange-600 animate-pulse" />
                Wood-Fired & Artisanal Kitchen
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
                Culinary Craft, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                  Fire-Kissed
                </span>{" "}
                Perfection.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Indulge in authentic 48-hour fermented Napoli pizzas, double-patty smash burgers, and fresh bronze-cut pastas delivered piping hot to your doorstep.
              </p>

              {/* Action Buttons & Track */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-base px-8 py-4 rounded-full shadow-lg shadow-orange-600/30 transition transform active:scale-95"
                >
                  <span>Order Online Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/track"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-stone-800 font-bold text-base px-6 py-4 rounded-full border border-stone-300 shadow-xs transition"
                >
                  <Search className="w-4 h-4 text-stone-500" />
                  <span>Track Live Order</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-200/70 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-2xl font-black text-stone-900">30 min</p>
                  <p className="text-xs text-stone-500 font-semibold">Average Delivery</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-stone-900">4.9 ★</p>
                  <p className="text-xs text-stone-500 font-semibold">500+ Reviews</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-stone-900">450°C</p>
                  <p className="text-xs text-stone-500 font-semibold">Stone Hearth Oven</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-1 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80"
                    alt="Artisan Truffle Burrata Pizza"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white">
                      <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                        Chef's Special
                      </span>
                      <h3 className="text-xl font-black mt-1">Truffle Burrata Margherita</h3>
                      <p className="text-xs text-stone-300">San Marzano tomatoes, fresh burrata & white truffle oil</p>
                    </div>
                  </div>
                </div>

                {/* Floating promo badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black">
                    50%
                  </div>
                  <div>
                    <p className="text-xs font-black text-stone-900">Use Code: WELCOME50</p>
                    <p className="text-[11px] text-stone-500 font-medium">Flat 50% off first order</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
              Explore Our Menu
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Handcrafted Categories
            </h2>
          </div>
          <Link
            href="/menu"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.slug}`}
              className="group bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-orange-300 hover:shadow-lg transition-all text-center flex flex-col items-center"
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-stone-100 mb-3 group-hover:scale-105 transition-transform">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-stone-400">
                    AG
                  </div>
                )}
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-stone-900 group-hover:text-orange-600 transition-colors leading-tight">
                {cat.name}
              </h3>
              <span className="text-[11px] text-stone-400 font-medium mt-1">
                {cat._count.products} dishes
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured & Trending Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
              Signature Dishes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Popular From The Oven
            </h2>
          </div>
          <Link
            href="/menu"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 transition"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDishes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Why Antigravity Bistro */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black text-orange-400 uppercase tracking-widest">
              Our Commitment
            </span>
            <h2 className="text-3xl font-extrabold mt-1">The Antigravity Quality Standard</h2>
            <p className="text-stone-400 text-sm mt-3">
              We never cut corners on quality, fermentation time, or delivery speed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/60 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base">450°C Stone Oven</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Imported stone hearth baking produces leopard-spotted crusts with ethereal crunch.
              </p>
            </div>

            <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/60 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base">48h Dough Fermentation</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Slow cold-matured sourdough is naturally easy on digestion and richly aromatic.
              </p>
            </div>

            <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/60 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base">Farm-Direct Produce</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                San Marzano tomatoes, artisanal burrata, and prime organic farm greens.
              </p>
            </div>

            <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/60 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base">Insulated Thermal Delivery</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Custom vapor-sealed packaging guarantees steam doesn't make crusts soggy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Real Customer Testimonials */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
              Customer Love
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              What Foodies Say About Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-stone-700 text-sm italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-black text-stone-900">{rev.userName}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Verified Foodie
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
