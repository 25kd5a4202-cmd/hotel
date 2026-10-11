"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      await refreshUser();
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Failed to register account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-stone-200/90 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 pt-2">Create an Account</h1>
          <p className="text-stone-500 text-xs">Join our gourmet family for exclusive offers & fast ordering</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohit Verma"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohit@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98444 55566"
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
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-extrabold text-sm py-3 px-6 rounded-xl shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <span>{loading ? "Creating..." : "Create Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-center text-stone-500">
          Already have an account?{" "}
          <Link href="/login" className="font-extrabold text-orange-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
