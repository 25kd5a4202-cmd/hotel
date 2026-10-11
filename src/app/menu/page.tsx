import React, { Suspense } from "react";
import { getCategories, getProducts } from "@/services/menu";
import { MenuClient } from "./MenuClient";

export const metadata = {
  title: "Full Menu | Antigravity Bistro & Kitchen",
  description: "Browse our entire menu of artisan pizzas, gourmet smash burgers, and fresh pastas.",
};

export default async function MenuPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center sm:text-left">
        <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
          Fresh From The Hearth
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mt-1">
          Explore Our Complete Menu
        </h1>
        <p className="text-stone-500 text-sm mt-2 max-w-2xl">
          Everything cooked fresh to order using heirloom flours, San Marzano tomatoes, and artisanal cheeses.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-20 text-stone-400 font-bold">Loading Menu...</div>}>
        <MenuClient initialCategories={categories} initialProducts={products} />
      </Suspense>
    </div>
  );
}
