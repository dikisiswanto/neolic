import { createCorsResponse, createErrorResponse } from '@/lib/api-utils';
import { getProductBySerialNumber } from '@/lib/queries/products';
import { getSaleByVillageId } from '@/lib/queries/sales';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    let body;
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.text();
      body = Object.fromEntries(new URLSearchParams(formData));
    } else {
      return createErrorResponse('Unsupported Content-Type', 400, 200);
    }

    const { token, village_id, serial_number, theme_version } = body;

    if (!token || !village_id || !serial_number) {
      return createErrorResponse('Missing token, village_id, or serial_number', 400, 200);
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    if (decoded.village_id == village_id && decoded.products.serial_number == serial_number) {
      const { data: purchase, error: errorPurchase } = await getSaleByVillageId(village_id);
      const { data: product, error: errorProduct } = await getProductBySerialNumber(serial_number);

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

      const isOutdate = theme_version < product.current_version;

      return createCorsResponse(
        { status: 'success', registered: true, data: purchase, is_outdate: isOutdate },
        200
      );
    }

    return createErrorResponse('Token provided failed to verify', 403, 200);
  } catch (err) {
    return createErrorResponse('Invalid request format', 400, 200);
  }
}
