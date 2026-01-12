import crypto from 'crypto';

export function generateProof({ village_id, serial_number }) {
  const ts = Math.floor(Date.now() / 1000);

  const payload = `${village_id}|${serial_number}|${ts}`;

  const signature = crypto
    .createHmac('sha256', process.env.TOKEN_SECRET)
    .update(payload)
    .digest('hex');

  const ctx = Buffer.from(`${village_id}|${serial_number}`).toString('base64').slice(0, 4);

  return `${signature}:${ts}:${ctx}`;
}
