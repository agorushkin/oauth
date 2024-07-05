import { Handler } from 'x/http';
import { AuthPayload } from '/lib/data/types.ts';

import { generateSalt } from '/lib/src/crypto/salt.ts';
import { hashPassword } from '/lib/src/crypto/hash.ts';
import { res } from '/lib/src/util/response.ts';
import { db } from '/lib/main.ts';

export const handler: Handler = async (
  { json, responded, respond },
) => {
  if (responded) return;

  const data = await json<AuthPayload>()
    .catch(() => null);

  if (
    !data ||
    typeof data.name !== 'string' ||
    typeof data.password !== 'string'
  ) {
    return respond(res('INVALID_PAYLOAD'));
  }

  const { name, password } = data;

  if (!/^[_A-Za-z]{3,12}$/.test(name)) {
    return respond(res('INVALID_NAME'));
  }

  if (!/^[A-Za-z0-9!@#$%^&*()_+]{8,32}$/.test(password)) {
    return respond(res('INVALID_PASSWORD'));
  }

  if (db.data?.users?.[name]) {
    return respond(res('CONFLICT'));
  }

  const ok = await db.update(async ({ users }) => {
    const salt = generateSalt();
    const hash = await hashPassword(password, salt);

    users[data.name] = {
      hash,
      salt,
    };
  });

  respond(ok ? res('CREATED') : res('INTERNAL_ERROR'));
};
