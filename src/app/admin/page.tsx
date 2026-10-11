import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAdminKPIs, getAdminOrders, getTopSellingProducts } from "@/services/admin";
import prisma from "@/lib/db";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Portal | Antigravity Bistro",
  description: "Real-time kitchen management, order tracking, and sales analytics.",
};

export default async function AdminPage() {
  const session = await getCurrentUser();
  if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
    redirect("/login");
  }

  const [kpis, recentOrders, topSelling, allProducts, allCategories] = await Promise.all([
    getAdminKPIs(),
    getAdminOrders({ limit: 30 }),
    getTopSellingProducts(5),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AdminDashboardClient
        initialKPIs={kpis}
        initialOrders={recentOrders}
        topSelling={topSelling}
        products={allProducts}
        categories={allCategories}
        currentAdmin={session}
      />
    </div>
  );
}
