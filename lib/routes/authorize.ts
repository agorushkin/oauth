import type { Handler } from '/lib/data/types.ts';

import { parseToken } from '/lib/src/auth/token.ts';
import { parseScope } from '/lib/src/auth/scope.ts';
import { res } from '/lib/src/util/response.ts';
import { db } from '/lib/main.ts';

export const handler: Handler = async (
  { headers, locals, responded, response },
) => {
  if (responded) return;

  const header = headers.get('authorization');

  if (
    !header ||
    !header.startsWith('Bearer ')
  ) {
    res('UNAUTHORIZED', response);

    return;
  }

  const token = header.replace('Bearer ', '');

  if (!token || token.length === 0) {
    res('UNAUTHORIZED', response);

    return;
  }

  const payload = await parseToken(token);

  if (!payload) {
    res('UNAUTHORIZED', response);

    return;
  }

  if (!db.data.users[payload.usr]) {
    res('UNAUTHORIZED', response);

    return;
  }

  const scope = parseScope(payload.scp);

  locals.user = payload.usr;
  locals.scope = scope;
  locals.authed = true;
};
