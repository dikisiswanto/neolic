import { CORS_HEADERS, createCorsResponse, createErrorResponse } from '@/lib/api-utils';
import { getProductBySerialNumber } from '@/lib/queries/products';
import { getSaleByVillageId } from '@/lib/queries/sales';
import { generateProof } from '@/lib/security';
import { NextResponse } from 'next/server';

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const body = contentType.includes('application/json')
      ? await req.json()
      : Object.fromEntries(new URLSearchParams(await req.text()));

    const { village_id, serial_number } = body;

    if (!village_id || !serial_number) {
      return createErrorResponse('Missing village_id or serial_number', 400, 200);
    }

    const [{ data: purchase }, { data: product }] = await Promise.all([
      getSaleByVillageId(village_id),
      getProductBySerialNumber(serial_number),
    ]);

    const exists = !!purchase && !!product && purchase.product_id === product.id;

    if (!exists) {
      return createCorsResponse({ status: 'success', exists: false }, 200);
    }

    const proof = generateProof({ village_id, serial_number });

    return createCorsResponse(
      {
        status: 'success',
        exists: true,
        proof,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return createErrorResponse('Invalid request format', 400, 200);
  }
}
