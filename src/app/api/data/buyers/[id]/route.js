import { getBuyerById } from '@/lib/queries/buyers';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const buyer = await getBuyerById(id);

    if (!buyer) {
      return Response.json({ message: 'Pembeli tidak ditemukan' }, { status: 404 });
    }

    return Response.json({ data: buyer }, { status: 200 });
  } catch (error) {
    console.error('Gagal mendapatkan data pembeli berdasarkan ID', error);
    return Response.json(
      { message: 'Gagal mendapatkan data pembeli', error: error.message },
      { status: 500 }
    );
  }
}
