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
  return createCorsResponse(
    {
      status: 'error',
      code,
      message,
      registered: false,
      redir_uri: 'https://silirdev.com/403.html',
    },
    status
  );
}

export function authenticateRequest(headers) {
  const bearerToken =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6IjIwMjIwMTAxIiwibmFtZSI6IkpXVCBUb2tlbiB1bnR1ay இரவு Temas IiwiaWF0IjoxNTE2MjM5MDIyfQ.f5yfPN0RqqDQHrxZeDq3bIpxDtyGuyr8Nsso2-FZVDU';

  const authorization = headers.get('authorization');
  return bearerToken === authorization;
}
