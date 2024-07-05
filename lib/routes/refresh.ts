import { Handler } from 'x/http';

import { getNumericDate } from 'x/jwt';
import { generateToken } from '/lib/src/auth/token.ts';
import { res } from '/lib/src/util/response.ts';
import { db } from '/lib/main.ts';

export const handler: Handler = async (
  { cookie, responded, response, respond },
) => {
  if (responded) return;

  if (!cookie.has('refresh')) {
    return respond(res('UNAUTHORIZED'));
  }

  const refresh = cookie.get('refresh') ?? '';

  if (!refresh || refresh.length === 0) {
    return respond(res('UNAUTHORIZED'));
  }

  const refreshEntry = db.data?.refreshes?.[refresh];

  if (!refreshEntry || refreshEntry.expires < Date.now()) {
    return respond(res('UNAUTHORIZED'));
  }

  const { refresh: newRefresh, token, expires } = await generateToken(
    refreshEntry.user,
    refreshEntry.scope,
  );

  const updated = await db.update(({ refreshes, invalid }) => {
    invalid.push(refreshes?.[refresh]?.token);
    delete refreshes[refresh];

    const scope = refreshEntry.scope;

    refreshes[newRefresh] = {
      user: refreshEntry.user,
      token,
      scope,
      expires: getNumericDate(60 * 60 * 24 * 7) * 1000,
    };
  });

  if (updated) {
    response.status = 200;
    response.body = JSON.stringify({
      expires,
      refresh: newRefresh,
      token,
    });
  } else res('INTERNAL_ERROR', response);

  respond();
};
