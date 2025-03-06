import { NextResponse } from 'next/server';
import { getVillages } from '@/lib/queries/villages';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 10;

    const { data, count } = await getVillages({ search, page, pageSize });

    return NextResponse.json({ data, total: count, page, pageSize }, { status: 200 });
  } catch (error) {
    console.error('Error saat mengambil data desa:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
