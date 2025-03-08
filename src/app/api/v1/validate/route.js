import {
  createCorsResponse,
  createErrorResponse,
  authenticateRequest,
  CORS_HEADERS,
} from '@/lib/api-utils';
import { getProductBySerialNumber } from '@/lib/queries/products';
import { getSaleByUrl } from '@/lib/queries/sales';
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

    if (!authenticateRequest(req.headers)) {
      return createErrorResponse('Unauthorized access', 401, 401);
    }

    const url = body.url ? new URL(body.url.replace(/www\./g, '')).hostname : null;
    const [{ data: purchase, error: errorPurchase }, { data: product, error: errorProduct }] =
      await Promise.all([getSaleByUrl(url), getProductBySerialNumber(body.serial_number)]);

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
        is_outdate: body.theme_version < product.current_version,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return createErrorResponse('Invalid request format', 400, 200);
  }
}
