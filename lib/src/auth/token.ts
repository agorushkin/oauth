import { Permission, TokenContent } from '/lib/data/types.ts';

import { Scope } from '/lib/src/auth/scope.ts';

import { create, verify } from 'x/jwt';
import { key } from '/lib/src/crypto/key.ts';
import { generateULID } from '/lib/src/crypto/ulid.ts';
import { elapse } from '/lib/src/util/elapse.ts';
import { guard } from '/lib/src/util/guard.ts';

export class Token {
  static generate = async (user: string, permissions: Permission[]) => {
    const expires = elapse(60 * 60);
    const refresh = generateULID();
    const scope = Scope.from(permissions);
    const id = generateULID();

    const token = await create({
      alg: 'HS512',
      typ: 'JWT',
    }, {
      usr: user,
      scp: scope,
      exp: expires,
      jti: id,
    }, key);

    return { token, refresh, expires };
  };

  static parse = async (token: string) => {
    const { ok, value } = await guard(verify<TokenContent>, token, key, {
      ignoreExp: true,
    });

    return ok ? value : null;
  };
}
