import { Handler } from 'x/http';
import { ExchangePayload } from '/lib/data/types.ts';

import { getNumericDate } from 'x/jwt';
import { generateToken } from '/lib/src/auth/token.ts';
import { res } from '/lib/src/util/response.ts';
import { db } from '/lib/main.ts';

export const handler: Handler = async (
  { json, responded, response, respond },
) => {
  if (responded) return;

  const data = await json<ExchangePayload>()
    .catch(() => null);

  if (
    !data ||
    typeof data.code !== 'string' ||
    typeof data.client !== 'string' ||
    typeof data.secret !== 'string'
  ) {
    res('INVALID_PAYLOAD', response);

    return respond();
  }

  if (
    db.data?.clients?.[data.client] !== data.secret ||
    !db.data?.codes?.[data.code] ||
    db.data?.codes?.[data.code].client !== data.client ||
    db.data?.codes?.[data.code].expires < Date.now()
  ) {
    res('UNAUTHORIZED', response);

    return respond();
  }

  const { user, scope } = db.data.codes[data.code];

  const {
    expires,
    refresh,
    token,
  } = await generateToken(user, scope);

  const ok = await db.update(({ refreshes, codes }) => {
    delete codes[data.code];

    refreshes[refresh] = {
      user,
      token,
      scope,
      expires: getNumericDate(60 * 60 * 24 * 90),
    };
  });

  if (ok) {
    res('OK', response);
    response.body = JSON.stringify({
      expires,
      refresh,
      token,
    });
  } else res('INTERNAL_ERROR', response);

  respond();
};
