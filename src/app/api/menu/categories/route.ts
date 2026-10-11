import { NextResponse } from "next/server";
import { getCategories } from "@/services/menu";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
