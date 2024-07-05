export enum PERMISSIONS {
  READ = 0b001,
  WRITE = 0b010,
  EXEC = 0b100,
  AUTH = 0b1000,
  ADMIN = 0b10000,
}

export const RESPONSES = {
  OK: { status: 200, body: 'ok' },
  CREATED: { status: 201, body: 'created' },
  NO_CONTENT: { status: 204, body: 'no-content' },
  INVALID_REQUEST: { status: 400, body: 'invalid-request' },
  INVALID_NAME: { status: 400, body: 'invalid-name' },
  INVALID_PASSWORD: { status: 400, body: 'invalid-password' },
  INVALID_PAYLOAD: { status: 400, body: 'invalid-payload' },
  UNAUTHORIZED: { status: 401, body: 'unauthorized' },
  FORBIDDEN: { status: 403, body: 'forbidden' },
  NOT_FOUND: { status: 404, body: 'not-found' },
  CONFLICT: { status: 409, body: 'conflict' },
  INTERNAL_ERROR: { status: 500, body: 'internal-error' },
};

export const KEY_CONFIG = [
  {
    name: 'HMAC',
    hash: 'SHA-512',
  } as Algorithm,
  true,
  ['sign', 'verify'],
] as [Algorithm, boolean, KeyUsage[]];
