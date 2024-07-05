import { JWTPayload } from '/lib/data/types.ts';

import { create, getNumericDate, verify } from 'x/jwt';
import { key } from '/lib/src/crypto/key.ts';
import { generateUlid } from '/lib/src/crypto/ulid.ts';
import { guard } from '/lib/src/util/guard.ts';

export const generateToken = async (user: string, scope: number) => {
  const expires = getNumericDate(60 * 60);

  const token = await create({
    alg: 'HS512',
    typ: 'JWT',
  }, {
    usr: user,
    scp: scope,
    exp: expires,
  }, key);

  return {
    token,
    expires,
    refresh: generateUlid(),
  };
};

export const parseToken = async (token: string) => {
  const { ok, value } = await guard(verify<JWTPayload>, token, key);

  return ok ? value : null;
};
