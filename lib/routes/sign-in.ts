import { Handler } from 'x/http';
import { AuthPayload } from '/lib/data/types.ts';

import { getNumericDate } from 'x/jwt';
import { calculateScope } from '/lib/src/auth/scope.ts';
import { hashPassword } from '/lib/src/crypto/hash.ts';
import { generateToken } from '/lib/src/auth/token.ts';
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

  if (!db.data.users[data.name]) {
    return respond(res('UNAUTHORIZED'));
  }

  const user = db.data.users[data.name];
  const hash = await hashPassword(data.password, user.salt);

  if (hash !== user.hash) {
    return respond(res('UNAUTHORIZED'));
  }

  const scope = calculateScope(['READ', 'WRITE', 'EXEC', 'AUTH']);
  const {
    expires,
    refresh,
    token,
  } = await generateToken(
    data.name,
    scope,
  );

  const ok = await db.update(({ refreshes }) => {
    refreshes[refresh] = {
      user: data.name,
      token,
      scope,
      expires: getNumericDate(60 * 60 * 24 * 90),
    };
  });

  respond(
    ok
      ? { ...res('OK'), body: JSON.stringify({ expires, refresh, token }) }
      : res('INTERNAL_ERROR'),
  );
};
