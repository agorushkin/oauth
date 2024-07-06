import type { Handler } from 'x/http';

import { Token } from '/lib/src/auth/token.ts';

import { generateULID } from '/lib/src/crypto/ulid.ts';
import { elapse } from '/lib/src/util/elapse.ts';
import { res } from '/lib/src/util/response.ts';
import { db } from '/lib/main.ts';

export const handler: Handler = async (
  { cookie, responded, respond },
) => {
  if (responded) return;

  if (!cookie.has('refresh')) {
    return respond(res('UNAUTHORIZED'));
  }

  const refresh = cookie.get('refresh') ?? '';
  const refreshes = db.data?.refreshes;

  if (!refresh || refresh.length === 0) {
    return respond(res('UNAUTHORIZED'));
  }

  const entry = refreshes[refresh];

  if (!entry || entry.expires < elapse(0)) {
    return respond(res('UNAUTHORIZED'));
  }

  const { token, refresh: newRefresh, expires } = await Token.generate(
    entry.user,
    entry.scope,
  );

  const isUpated = await db.update(({ refreshes, blacklist }) => {
    blacklist.push();
    delete refreshes[refresh];

    const scope = entry.scope;

    refreshes[newRefresh] = {
      user: entry.user,
      id: generateULID(),
      scope,
      expires: elapse(60 * 60 * 24 * 7),
    };
  });

  respond(
    isUpated
      ? { ...res('OK'), body: JSON.stringify({ expires, refresh, token }) }
      : res('INTERNAL_ERROR'),
  );
};
