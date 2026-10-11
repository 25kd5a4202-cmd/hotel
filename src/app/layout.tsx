import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Antigravity Bistro & Kitchen | Wood-Fired Gourmet Food Ordering",
  description:
    "Experience Naples-style wood-fired pizzas, artisan smash burgers, handcrafted pastas, and decadent desserts. Order online for fast delivery.",
  keywords: ["restaurant", "food delivery", "wood-fired pizza", "smash burgers", "gourmet dining"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-orange-500 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
