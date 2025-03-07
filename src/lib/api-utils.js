import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function createCorsResponse(response, status) {
  return NextResponse.json(response, { status, headers: CORS_HEADERS });
}

export function createErrorResponse(message, code, status) {
  return createCorsResponse({ status: 'error', code, message }, status);
}
