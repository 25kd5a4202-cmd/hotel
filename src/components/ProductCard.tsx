"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Clock, Star } from "lucide-react";
import { formatPrice } from "@/lib/pricing";
import { useCart } from "@/context/CartContext";
import { ProductCustomizerModal, CustomizerProduct } from "@/components/ProductCustomizerModal";

export interface ProductCardProps {
  product: CustomizerProduct & {
    preparationTime?: number;
    _count?: { reviews: number };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const [modalOpen, setModalOpen] = useState(false);

  // Check if any variant of this product is in cart
  const cartItemsForProduct = items.filter((i) => i.productId === product.id);
  const totalQtyInCart = cartItemsForProduct.reduce((sum, i) => sum + i.quantity, 0);

  const hasCustomizations = product.variants.length > 0 || product.addOnGroups.length > 0;

  const handleAddClick = () => {
    if (hasCustomizations) {
      setModalOpen(true);
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        isVeg: product.isVeg,
        unitPrice: product.basePrice,
        selectedAddOns: [],
        quantity: 1,
      });
    }
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-orange-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
        {/* Image Container */}
        <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-xs uppercase tracking-wider">
              No Image
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={product.isVeg ? "veg-badge" : "nonveg-badge"} />
            {product.preparationTime && (
              <span className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 text-orange-400" />
                {product.preparationTime}m
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h3 className="font-extrabold text-base text-stone-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </div>
            <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed mb-4">
              {product.description}
            </p>
          </div>

          {/* Pricing & Add to Cart button */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-auto">
            <div>
              <span className="text-xs text-stone-400 block font-medium">Starting at</span>
              <span className="font-black text-lg text-stone-900">
                {formatPrice(product.basePrice)}
              </span>
            </div>

            <div>
              {totalQtyInCart > 0 && !hasCustomizations ? (
                <div className="flex items-center bg-orange-50 border border-orange-500 rounded-xl overflow-hidden font-black text-orange-600">
                  <button
                    onClick={() => updateQuantity(cartItemsForProduct[0].id, -1)}
                    className="px-2.5 py-1.5 hover:bg-orange-100 transition active:scale-95"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-xs font-bold text-stone-900">{totalQtyInCart}</span>
                  <button
                    onClick={() => updateQuantity(cartItemsForProduct[0].id, 1)}
                    className="px-2.5 py-1.5 hover:bg-orange-100 transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddClick}
                  className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-xs shadow-orange-600/30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{hasCustomizations ? "Customize" : "Add"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {hasCustomizations && (
        <ProductCustomizerModal
          product={product}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
