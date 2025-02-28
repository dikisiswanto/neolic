import { NextResponse } from "next/server";
import { getSales } from "@/lib/queries/sales";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // 📌 Ambil query params dari URL
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")) || 10;
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";
    const search = searchParams.get("search") || "";
    const startDate = searchParams.get("startDate") || null;
    const endDate = searchParams.get("endDate") || null;

    const { data, count } = await getSales({
      page,
      pageSize,
      sort,
      order,
      search,
      startDate,
      endDate,
    });

    return NextResponse.json(
      { data, total: count, page, pageSize },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
