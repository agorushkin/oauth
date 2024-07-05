import type { Handler } from '/lib/data/types.ts';

import { getNumericDate } from 'x/jwt';
import { generateCode } from '/lib/src/crypto/code.ts';
import { res } from '/lib/src/util/response.ts';
import { db } from '/lib/main.ts';

export const handler: Handler = async (
  { query, locals, responded, respond, redirect },
) => {
  if (responded) return;

  const { authed, scope: granted, user } = locals;

  if (!authed || !user || !granted?.includes('AUTH')) {
    return respond(res('UNAUTHORIZED'));
  }

  if (
    !query.has('client') ||
    !query.has('redirect') ||
    !query.has('scope')
  ) {
    return respond(res('INVALID_REQUEST'));
  }

  const client = query.get('client') ?? '';
  const target = query.get('redirect') ?? '';
  const scope = query.get('scope') ?? '';

  if (
    !client || client.length === 0 ||
    !redirect || redirect.length === 0 ||
    !scope || isNaN(parseInt(scope))
  ) {
    return respond(res('INVALID_REQUEST'));
  }

  if (!db.data?.clients?.[client]) {
    return respond(res('UNAUTHORIZED'));
  }

  const code = generateCode(4);

  const ok = await db.update(({ codes }) => {
    codes[code] = {
      client,
      user: user,
      scope: parseInt(scope),
      expires: getNumericDate(60 * 5),
    };
  });

  redirect(
    target + ok ? `?code=${code}` : '?error=server_error',
  );
};
