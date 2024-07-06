import type { Handler } from 'x/http';
import type { AuthPayload, Permission } from '/lib/data/types.ts';

import { Token } from '/lib/src/auth/token.ts';

import { hashPassword } from '/lib/src/crypto/hash.ts';
import { generateULID } from '/lib/src/crypto/ulid.ts';
import { elapse } from '/lib/src/util/elapse.ts';
import { res } from '/lib/src/util/response.ts';
import { db } from '/lib/main.ts';

export const handler: Handler = async (
  { json, responded, respond },
) => {
  if (responded) return;

  const users = db.data?.users;
  const data = await json<AuthPayload>()
    .catch(() => null);

  const isPayloadValid = data &&
    typeof data?.name === 'string' &&
    typeof data?.password === 'string';

  if (!isPayloadValid) {
    return respond(res('INVALID_PAYLOAD'));
  }

  const isUserValid = users && users[data.name];

  if (!isUserValid) {
    return respond(res('UNAUTHORIZED'));
  }

  const user = db.data.users[data.name];
  const hash = await hashPassword(data.password, user.salt);

  if (hash !== user.hash) {
    return respond(res('UNAUTHORIZED'));
  }

  const scope = ['READ', 'WRITE', 'EXEC', 'AUTH'] as Permission[];
  const {
    expires,
    refresh,
    token,
  } = await Token.generate(
    data.name,
    scope,
  );

  const isUpdated = await db.update(({ refreshes }) => {
    refreshes[refresh] = {
      user: data.name,
      id: generateULID(),
      scope,
      expires: elapse(60 * 60 * 24 * 90),
    };
  });

  respond(
    isUpdated
      ? { ...res('OK'), body: JSON.stringify({ expires, refresh, token }) }
      : res('INTERNAL_ERROR'),
  );
};
