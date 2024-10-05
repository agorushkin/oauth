const UINT32_RADIX = Math.pow(2, 32);
const UINT8_MAX = 0b11111111;
const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export const generate_ulid = (): string => {
  const time = Date.now();
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  const low = time % UINT32_RADIX;
  const high = (time - low) / UINT32_RADIX;

  let idx = -1;

  bytes[++idx] = (high >>> 8) & UINT8_MAX;
  bytes[++idx] = (high >>> 0) & UINT8_MAX;
  bytes[++idx] = (low >>> 24) & UINT8_MAX;
  bytes[++idx] = (low >>> 16) & UINT8_MAX;
  bytes[++idx] = (low >>> 8) & UINT8_MAX;
  bytes[++idx] = (low >>> 0) & UINT8_MAX;

  let id = '';

  for (const byte of bytes) id += ENCODING[byte % 32];

  return id;
};
