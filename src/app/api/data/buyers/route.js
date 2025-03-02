import { NextResponse } from "next/server";
import { getBuyers } from "@/lib/queries/buyers";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")) || 10;

    const { data, count } = await getBuyers({ search, page, pageSize });

    return NextResponse.json({ data, total: count, page, pageSize });
  } catch (error) {
    console.error("API Route Error (Buyers):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
