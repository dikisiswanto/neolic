import { getProductById } from "@/lib/queries/products";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return Response.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return Response.json({ data: product }, { status: 200 });
  } catch (error) {
    console.error("Gagal mendapatkan data produk berdasarkan ID", error);
    return Response.json(
      { message: "Gagal mendapatkan data produk", error: error.message },
      { status: 500 }
    );
  }
}
