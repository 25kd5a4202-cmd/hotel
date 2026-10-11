import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Award, Heart, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
          The Antigravity Heritage
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Where Fire Meets Flavor
        </h1>
        <p className="text-stone-600 text-base leading-relaxed">
          Founded on the uncompromising pursuit of culinary honesty, Antigravity Bistro crafts food designed to defy ordinary dining expectations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
            alt="Chef crafting pasta"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-stone-900">48-Hour Cold Fermentation</h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Our pizza dough undergoes a patient 48-hour cold fermentation process using organic stoneground wheat. Baked inside our 450°C stone hearth oven, the crust achieves a blistered, airy crumb with extraordinary flavor complexity that is effortlessly light on digestion.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
              <h3 className="text-xl font-black text-orange-950">100%</h3>
              <p className="text-xs text-orange-800 font-medium">Heirloom Italian Tomatoes</p>
            </div>
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
              <h3 className="text-xl font-black text-orange-950">Zero</h3>
              <p className="text-xs text-orange-800 font-medium">Artificial Additives</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black">Experience The Craft Today</h2>
        <p className="text-stone-400 text-sm max-w-xl mx-auto">
          Delivered piping hot with thermal vapor barrier boxes to retain crust crispness.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-full shadow-lg transition"
        >
          <span>Order From Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
