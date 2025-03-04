import { NextResponse } from "next/server";
import { deleteSale, updateSaleData } from "@/lib/queries/sales";

export async function PUT(request, { params }) {
  const { id } = await params;

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

    const updatedSales = await updateSaleData(id, salesData);

    if (!updatedSales) {
      return NextResponse.json({
        message: "Data penjualan gagal disimpan",
        status: 404,
      });
    }

    return NextResponse.json(
      { message: "Data penjualan berhasil disimpan", data: updatedSales },
      { status: 200 }
    );
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return NextResponse.error({
      message: "Data penjualan gagal disimpan",
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.badRequest({
        message: "Aksi delete membutuhkan ID penjualan",
      });
    }

    await deleteSale(id);

    return NextResponse.json(
      { message: "Data penjualan berhasil dihapus." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting sale data:", error);
    return NextResponse.internalServerError({
      message: "Data penjualan gagal dihapus",
      error: error.message,
    });
  }
}
