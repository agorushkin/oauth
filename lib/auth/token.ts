import type { Permission, TokenContent } from '/lib/data/types.ts';

import { Scope } from '/lib/auth/scope.ts';

import { create, verify } from 'x/jwt';
import { elapse } from '/lib/utils/elapse.ts';
import { generate_ulid } from '/lib/crypto/ulid.ts';
import { intercept } from '/lib/utils/intercept.ts';
import { key } from '/lib/crypto/key.ts';

export class Token {
  static generate = async (user: string, permissions: Permission[]) => {
    const expires = elapse(60 * 60);
    const refresh_token = generate_ulid();
    const scope = Scope.from(permissions);
    const id = generate_ulid();

    const access_token = await create({
      alg: 'HS512',
      typ: 'JWT',
    }, {
      usr: user,
      scp: scope,
      exp: expires,
      jti: id,
    }, key);

    return { access_token, refresh_token, expires };
  };

  static parse = async (token: string): Promise<TokenContent | null> => {
    const { ok, value } = await intercept(verify<TokenContent>, token, key, {
      ignoreExp: true,
    });

    return ok ? value : null;
  };
}
