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

    const { village_id, serial_number } = body;
    if (!village_id || !serial_number)
      return createErrorResponse('Missing village_id or serial_number', 400, 200);

    const { data: purchase, error: errorPurchase } = await getSaleByVillageId(parseInt(village_id));
    const { data: product, error: errorProduct } = await getProductBySerialNumber(serial_number);

    if (
      errorProduct ||
      errorPurchase ||
      !product ||
      !purchase ||
      product.id !== purchase.product_id
    ) {
      return createErrorResponse('Invalid product purchase', 403, 200);
    }

    const token = jwt.sign(purchase, process.env.TOKEN_SECRET);
    return createCorsResponse(
      { status: 'success', registered: true, data: { ...purchase, token } },
      200
    );
  } catch (error) {
    console.error('error', error);
    return createErrorResponse('Invalid request format', 400, 200);
  }
}