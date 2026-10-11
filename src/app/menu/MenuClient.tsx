"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Search, Filter, Sparkles } from "lucide-react";
import { CustomizerProduct } from "@/components/ProductCustomizerModal";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface MenuClientProps {
  initialCategories: CategoryItem[];
  initialProducts: any[];
}

export function MenuClient({ initialCategories, initialProducts }: MenuClientProps) {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryParam);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== "all" && product.category?.slug !== selectedCategory) {
        return false;
      }
      // Veg only
      if (vegOnly && !product.isVeg) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [initialProducts, selectedCategory, vegOnly, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pizza, pasta, burger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
          />
        </div>

        {/* Veg Only Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="veg-badge" />
            <span className="text-xs sm:text-sm font-bold text-stone-700">Veg Only</span>
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors ${
                vegOnly ? "bg-green-600" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transform transition-transform ${
                  vegOnly ? "translate-x-4.5" : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>
      </div>

      {/* Category Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
            selectedCategory === "all"
              ? "bg-orange-600 text-white shadow-md shadow-orange-600/25"
              : "bg-white text-stone-700 border border-stone-200 hover:border-stone-300 hover:bg-stone-50"
          }`}
        >
          All Menu
        </button>
        {initialCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
              selectedCategory === cat.slug
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/25"
                : "bg-white text-stone-700 border border-stone-200 hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Results Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No dishes match your criteria</h3>
          <p className="text-xs text-stone-500">
            Try adjusting your search terms or clearing the vegetarian filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setVegOnly(false);
              setSelectedCategory("all");
            }}
            className="text-xs font-black text-orange-600 uppercase tracking-wider hover:underline pt-2 block"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
