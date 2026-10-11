"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Check } from "lucide-react";
import { formatPrice } from "@/lib/pricing";
import { useCart, SelectedAddOn } from "@/context/CartContext";

export interface CustomizerProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  basePrice: number;
  isVeg: boolean;
  variants: Array<{
    id: string;
    name: string;
    priceModifier: number;
    isDefault: boolean;
  }>;
  addOnGroups: Array<{
    id: string;
    name: string;
    minSelect: number;
    maxSelect: number;
    isRequired: boolean;
    options: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  }>;
}

interface ModalProps {
  product: CustomizerProduct;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductCustomizerModal({ product, isOpen, onClose }: ModalProps) {
  const { addItem } = useCart();

  // Selected variant default
  const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    defaultVariant?.id
  );

  // Selected add-ons map: group ID -> array of selected option IDs
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  // Selected variant object
  const currentVariant = product.variants.find((v) => v.id === selectedVariantId);
  const variantPrice = currentVariant ? currentVariant.priceModifier : 0;

  // Calculate selected add-ons list and extra price
  const activeAddOnsList: SelectedAddOn[] = [];
  let addOnsPrice = 0;

  product.addOnGroups.forEach((group) => {
    const selectedIds = selectedAddOns[group.id] || [];
    group.options.forEach((opt) => {
      if (selectedIds.includes(opt.id)) {
        activeAddOnsList.push({ id: opt.id, name: opt.name, price: opt.price });
        addOnsPrice += opt.price;
      }
    });
  });

  const unitPrice = product.basePrice + variantPrice + addOnsPrice;
  const totalPrice = unitPrice * quantity;

  const toggleOption = (groupId: string, optionId: string, maxSelect: number) => {
    setSelectedAddOns((prev) => {
      const current = prev[groupId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter((id) => id !== optionId) };
      }
      if (maxSelect === 1) {
        return { ...prev, [groupId]: [optionId] };
      }
      if (current.length < maxSelect) {
        return { ...prev, [groupId]: [...current, optionId] };
      }
      return prev;
    });
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      isVeg: product.isVeg,
      unitPrice,
      variantId: currentVariant?.id,
      variantName: currentVariant?.name,
      selectedAddOns: activeAddOnsList,
      quantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="relative p-5 border-b border-stone-100 flex items-start justify-between">
          <div className="flex items-center gap-3 pr-8">
            <span className={product.isVeg ? "veg-badge" : "nonveg-badge"} />
            <div>
              <h3 className="font-extrabold text-lg text-stone-900 leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{product.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {product.image && (
            <div className="relative h-44 w-full rounded-xl overflow-hidden bg-stone-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 500px"
              />
            </div>
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div>
              <h4 className="font-bold text-sm text-stone-900 uppercase tracking-wider mb-2.5">
                Select Portion Size
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition text-left ${
                      selectedVariantId === variant.id
                        ? "border-orange-600 bg-orange-50/50 text-orange-950 ring-1 ring-orange-600"
                        : "border-stone-200 hover:border-stone-300 text-stone-700"
                    }`}
                  >
                    <span>{variant.name}</span>
                    <span className="text-xs font-bold text-stone-500">
                      {variant.priceModifier > 0
                        ? `+${formatPrice(variant.priceModifier)}`
                        : variant.priceModifier < 0
                        ? `-${formatPrice(Math.abs(variant.priceModifier))}`
                        : "Included"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-on Groups */}
          {product.addOnGroups.map((group) => {
            const selectedInGroup = selectedAddOns[group.id] || [];
            return (
              <div key={group.id} className="border-t border-stone-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                    {group.name}
                  </h4>
                  <span className="text-xs text-stone-500 font-medium">
                    {group.maxSelect === 1 ? "Choose 1" : `Up to ${group.maxSelect}`}
                  </span>
                </div>
                <div className="space-y-2">
                  {group.options.map((opt) => {
                    const isSelected = selectedInGroup.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleOption(group.id, opt.id, group.maxSelect)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition text-left ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/40 text-stone-900 font-semibold"
                            : "border-stone-200 hover:border-stone-300 text-stone-600 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                              isSelected
                                ? "bg-orange-600 border-orange-600 text-white"
                                : "border-stone-300"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <span>{opt.name}</span>
                        </div>
                        <span className="text-xs font-bold text-stone-700">
                          +{formatPrice(opt.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-4">
          <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-stone-600 hover:bg-stone-100 font-bold text-sm"
            >
              -
            </button>
            <span className="px-3 py-2 text-sm font-black text-stone-900">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 text-stone-600 hover:bg-stone-100 font-bold text-sm"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm py-3 px-5 rounded-xl shadow-md shadow-orange-600/20 flex items-center justify-between transition active:scale-98"
          >
            <span>Add Item</span>
            <span>{formatPrice(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
