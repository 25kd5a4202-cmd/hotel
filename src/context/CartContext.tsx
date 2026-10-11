"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { calculateOrderFinancials, PriceBreakdown } from "@/lib/pricing";

export interface SelectedAddOn {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique item signature (productId + variantId + sorted addOnIds)
  productId: string;
  name: string;
  slug: string;
  image: string | null;
  isVeg: boolean;
  unitPrice: number;
  variantId?: string;
  variantName?: string;
  selectedAddOns: SelectedAddOn[];
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  financials: PriceBreakdown;
  coupon: AppliedCoupon | null;
  isPickup: boolean;
  setIsPickup: (val: boolean) => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isPickup, setIsPickup] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bistro_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("bistro_cart", JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [items, isLoaded]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const financials = calculateOrderFinancials({
    subtotal,
    discountTotal: coupon?.discountAmount || 0,
    isPickup,
    deliveryFeeRate: 4000,
    freeDeliveryThreshold: 50000,
    taxPercentage: 5.0,
  });

  const addItem = (item: Omit<CartItem, "id">) => {
    const addOnIds = item.selectedAddOns.map((a) => a.id).sort().join(",");
    const id = `${item.productId}_${item.variantId || "def"}_${addOnIds}`;

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...prev, { ...item, id }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (cp: AppliedCoupon) => {
    setCoupon(cp);
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        financials,
        coupon,
        isPickup,
        setIsPickup,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
