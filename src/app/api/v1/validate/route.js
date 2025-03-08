import { createCorsResponse, createErrorResponse, authenticateRequest } from '@/lib/api-utils';
import { getProductBySerialNumber } from '@/lib/queries/products';
import { getSaleByUrl } from '@/lib/queries/sales';

export async function POST(req) {
  try {
    const { headers } = req;
    let body;
    const contentType = headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.text();
      body = Object.fromEntries(new URLSearchParams(formData));
    } else {
      return createErrorResponse('Unsupported Content-Type', 400, 200);
    }

    if (!authenticateRequest(headers)) {
      return createErrorResponse(
        'Unauthorized access: Missing authorization header or invalid token',
        401,
        401
      );
    }

    const url = body.url ? new URL(body.url.replace(/www\./g, '')).hostname : null;
    const { data: purchase, error: errorPurchase } = await getSaleByUrl(url);
    const { data: product, error: errorProduct } = await getProductBySerialNumber(
      body.serial_number
    );

    if (errorProduct || errorPurchase) {
      return createErrorResponse(errorProduct?.message || errorPurchase?.message, 403, 200);
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
  } catch (err) {
    return createErrorResponse('Invalid request format', 400, 200);
  }
}
