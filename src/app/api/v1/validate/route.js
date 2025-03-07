import { createCorsResponse, createErrorResponse, authenticateRequest } from '@/lib/api-utils';
import { getProductBySerialNumber } from '@/lib/queries/products';
import { getSaleByUrl } from '@/lib/queries/sales';

export async function POST(req) {
  const { headers, json } = req;
  const body = await json();

  if (!authenticateRequest(headers)) {
    return createErrorResponse(
      'Unauthorized access: Missing authorization header or invalid token',
      401,
      401
    );
  }

  const url = body.url ? new URL(body.url.replace(/www\./g, '')).hostname : null;

  const { data: purchase, error: errorPurchase } = await getSaleByUrl(url);
  const { data: product, error: errorProduct } = await getProductBySerialNumber(body.serial_number);

  if (errorProduct || errorPurchase) {
    const errorMessage = errorProduct?.message || errorPurchase?.message;
    return createErrorResponse(errorMessage, 403, 200);
  }

  if (product.id !== purchase.product_id) {
    return createErrorResponse(
      'Your product purchase is not valid with serial number provided',
      403,
      200
    );
  }

  const isOutdate = body.theme_version < product.current_version;

  return createCorsResponse(
    { status: 'success', registered: true, data: purchase, is_outdate: isOutdate },
    200
  );
}
