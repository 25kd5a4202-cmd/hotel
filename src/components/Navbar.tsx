"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, User as UserIcon, Menu, X, Shield, Phone, Clock } from "lucide-react";
import { formatPrice } from "@/lib/pricing";

export function Navbar() {
  const { itemCount, financials } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" /> Open Today: 10:00 AM – 11:00 PM
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-orange-400" /> +91 98765 43210
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-orange-300 font-medium">Free Delivery above ₹500</span>
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-xs bg-orange-600 hover:bg-orange-700 text-white px-2 py-0.5 rounded font-medium transition"
              >
                <Shield className="w-3 h-3" /> Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              AG
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors">
                Antigravity<span className="text-orange-500">Bistro</span>
              </span>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-stone-500 -mt-1">
                Artisanal Kitchen & Bar
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-stone-700">
            <Link href="/menu" className="hover:text-orange-600 transition">
              Menu & Dishes
            </Link>
            <Link href="/track" className="hover:text-orange-600 transition">
              Track Order
            </Link>
            <Link href="/offers" className="hover:text-orange-600 transition">
              Offers & Coupons
            </Link>
            <Link href="/about" className="hover:text-orange-600 transition">
              Our Story
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-4">
            {/* Account / Auth */}
            {user ? (
              <div className="relative group">
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 px-3 py-2 rounded-full transition"
                >
                  <UserIcon className="w-4 h-4 text-orange-600" />
                  <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-stone-700 hover:text-orange-600 px-3 py-2 transition"
              >
                Sign In
              </Link>
            )}

            {/* Cart Trigger */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-md shadow-orange-600/25 transition-all"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {financials.grandTotal > 0 ? formatPrice(financials.grandTotal) : "Cart"}
              </span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-stone-800 hover:text-orange-600 py-1"
          >
            Menu & Dishes
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-stone-800 hover:text-orange-600 py-1"
          >
            Track Order
          </Link>
          <Link
            href="/offers"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-stone-800 hover:text-orange-600 py-1"
          >
            Offers & Coupons
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-stone-800 hover:text-orange-600 py-1"
          >
            Our Story
          </Link>
          {user ? (
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-sm font-medium text-stone-600">Logged in as {user.name}</span>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 font-semibold"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center font-bold text-sm bg-stone-100 text-stone-800 py-2.5 rounded-lg"
            >
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
