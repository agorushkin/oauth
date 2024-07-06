import type { Handler } from '/lib/data/types.ts';

import { Scope } from '/lib/src/auth/scope.ts';
import { Token } from '/lib/src/auth/token.ts';

import { elapse } from '/lib/src/util/elapse.ts';
import { res } from '/lib/src/util/response.ts';
import { db } from '/lib/main.ts';

export const handler: Handler = async (
  { headers, locals, responded, response },
) => {
  if (responded) return;

  locals.isAuthed = false;

  const header = headers.get('authorization');
  const isHeaderValid = header && header.startsWith('Bearer ');

  if (!isHeaderValid) {
    res('UNAUTHORIZED', response);

    return;
  }

  const token = header.replace('Bearer ', '');
  const isTokenValid = token.length > 0;

  if (!isTokenValid) {
    res('UNAUTHORIZED', response);

    return;
  }

  const payload = await Token.parse(token);

  const isPayloadValid = !!payload;
  const isTokenExpired = !isPayloadValid || payload.exp < elapse(0);
  const isTokenBlacklisted = !isPayloadValid ||
    db.data?.blacklist?.includes(payload.jti);

  const isTokenActual = !isTokenExpired && !isTokenBlacklisted;

  if (!isTokenActual) {
    res('UNAUTHORIZED', response);

    return;
  }

  const isUserActual = db.data.users[payload.usr];

  if (!isUserActual) {
    res('UNAUTHORIZED', response);

    return;
  }

  const scope = Scope.parse(payload.scp);

  locals.user = payload.usr;
  locals.scope = scope;
  locals.isAuthed = true;
  locals.id = payload.jti;
};
