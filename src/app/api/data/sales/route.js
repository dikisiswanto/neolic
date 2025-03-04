import { NextResponse } from "next/server";
import { getSales, createSaleData } from "@/lib/queries/sales";

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
    const productId = searchParams.get("productId") || null;

    const { data, count } = await getSales({
      page,
      pageSize,
      sort,
      order,
      search,
      startDate,
      endDate,
      productId,
    });

    return NextResponse.json(
      { data, total: count, page, pageSize },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const salesData = await request.json();

    const errors = {};

    if (!salesData.transactionDate) {
      errors.transactionDate = "Tanggal Transaksi wajib diisi.";
    }
    if (!salesData.domainURL) {
      errors.domainURL = "Domain URL wajib diisi.";
    }
    if (!salesData.villageId) {
      errors.villageId = "Desa wajib dipilih.";
    }
    if (!salesData.productId) {
      errors.productId = "Nama Produk wajib dipilih.";
    }
    if (!salesData.buyerId) {
      errors.buyerId = "Nama Pembeli wajib dipilih.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newSales = await createSaleData(salesData);

    return NextResponse.json(
      { message: "Data penjualan berhasil disimpan", data: newSales },
      { status: 201 }
    );
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return NextResponse.error({
      message: "Gagal menyimpan data penjualan",
      status: 500,
    });
  }
}
