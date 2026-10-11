"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, ArrowRight, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      await refreshUser();
      if (data.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-stone-200/90 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 pt-2">Welcome Back</h1>
          <p className="text-stone-500 text-xs">Sign in to track orders and view saved addresses</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-extrabold text-sm py-3 px-6 rounded-xl shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <p className="text-[11px] font-bold text-stone-400 text-center uppercase tracking-wider">
            Quick Fill Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("customer@example.com", "Customer@123456")}
              className="p-2 rounded-xl border border-stone-200 hover:border-orange-500 hover:bg-orange-50/40 text-[11px] font-bold text-stone-700 transition"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@antigravitybistro.com", "Admin@123456")}
              className="p-2 rounded-xl border border-stone-200 hover:border-orange-500 hover:bg-orange-50/40 text-[11px] font-bold text-stone-700 transition"
            >
              Head Chef (Admin)
            </button>
          </div>
        </div>

        <p className="text-xs text-center text-stone-500">
          Don't have an account yet?{" "}
          <Link href="/register" className="font-extrabold text-orange-600 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
