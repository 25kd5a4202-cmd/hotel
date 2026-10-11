import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/services/menu";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") || undefined;
    const isVegParam = searchParams.get("isVeg");
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.get("featured") === "true";

    const isVeg = isVegParam === "true" ? true : isVegParam === "false" ? false : undefined;

    const products = await getProducts({ categorySlug, isVeg, search, featured });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
