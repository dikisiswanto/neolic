import { CORS_HEADERS, createCorsResponse, createErrorResponse } from '@/lib/api-utils';
import { getProductBySerialNumber } from '@/lib/queries/products';
import { getSaleByVillageId } from '@/lib/queries/sales';
import jwt from 'jsonwebtoken';
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

    console.info('Request body:', body);

    const { token, village_id, serial_number, theme_version } = body;
    if (!token || !village_id || !serial_number) {
      return createErrorResponse('Missing token, village_id, or serial_number', 400, 200);
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (
      decoded.villages?.id !== parseInt(village_id, 10) ||
      decoded.products?.serial_number !== serial_number
    ) {
      return createErrorResponse('Token verification failed', 403, 200);
    }

    const [{ data: purchase, error: errorPurchase }, { data: product, error: errorProduct }] =
      await Promise.all([getSaleByVillageId(village_id), getProductBySerialNumber(serial_number)]);

    if (
      errorProduct ||
      errorPurchase ||
      !product ||
      !purchase ||
      product.id !== purchase.product_id
    ) {
      return createErrorResponse('Invalid product purchase', 403, 200);
    }

    return createCorsResponse(
      {
        status: 'success',
        registered: true,
        data: purchase,
        is_outdate: theme_version < product.current_version,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return createErrorResponse('Invalid request format', 400, 200);
  }
}
