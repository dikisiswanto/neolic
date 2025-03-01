import { NextResponse } from "next/server";
import { getProducts } from "@/lib/queries/products";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // 📌 Ambil query params dari URL untuk products
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")) || 10;
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";
    const search = searchParams.get("search") || "";

    const { data, count } = await getProducts({
      page,
      pageSize,
      sort,
      order,
      search,
    });

    return NextResponse.json(
      { data, total: count, page, pageSize },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
