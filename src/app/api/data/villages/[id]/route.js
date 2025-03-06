import { getVillageById } from '@/lib/queries/villages';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const village = await getVillageById(id);

    if (!village) {
      return Response.json({ message: 'Desa tidak ditemukan' }, { status: 404 });
    }

    return Response.json({ data: village }, { status: 200 });
  } catch (error) {
    console.error('Gagal mendapatkan data desa berdasarkan ID', error);
    return Response.json(
      { message: 'Gagal mendapatkan data desa', error: error.message },
      { status: 500 }
    );
  }
}
