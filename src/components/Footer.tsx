import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Globe, Share2, MessageCircle, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-lg">
                AG
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Antigravity<span className="text-orange-500">Bistro</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              Crafting honest, fire-kissed culinary masterpieces with locally sourced ingredients, wood-fired ovens, and uncompromising passion.
            </p>
            <div className="flex items-center space-x-3 text-stone-400">
              <a href="#" className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center hover:text-white hover:bg-orange-600 transition">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center hover:text-white hover:bg-orange-600 transition">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center hover:text-white hover:bg-orange-600 transition">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 tracking-wide">Explore Menu</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/menu?category=wood-fired-pizzas" className="hover:text-orange-400 transition">
                  Wood-Fired Pizzas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=artisan-burgers" className="hover:text-orange-400 transition">
                  Artisan Smash Burgers
                </Link>
              </li>
              <li>
                <Link href="/menu?category=pastas-bowls" className="hover:text-orange-400 transition">
                  Handcrafted Pastas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=starters-appetizers" className="hover:text-orange-400 transition">
                  Loaded Starters
                </Link>
              </li>
              <li>
                <Link href="/menu?category=desserts-shakes" className="hover:text-orange-400 transition">
                  Pastries & Shakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 tracking-wide">Visit & Contact</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                <span>104 Gourmet Square, Tech Boulevard, Silicon District, Bangalore 560001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>orders@antigravitybistro.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Everyday: 10:00 AM – 11:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Legal / Service Policies */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 tracking-wide">Customer Care</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/track" className="hover:text-orange-400 transition">
                  Track Live Order
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-orange-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cancellation-refund" className="hover:text-orange-400 transition">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-orange-400 transition">
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Antigravity Bistro & Kitchen. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for food enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
