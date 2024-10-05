import type { Handler } from '/lib/data/types.ts';

import { Token } from '/lib/auth/token.ts';

import { db } from '/main.ts';
import { elapse } from '/lib/utils/elapse.ts';
import { generate_ulid } from '/lib/crypto/ulid.ts';
import { prepare } from '/lib/utils/response.ts';

export const handler: Handler = async (
  { cookie, respond, responded },
) => {
  if (responded) return;

  const refresh_tokens = db.data?.refresh_tokens;
  const refresh_token = cookie.get('refresh_token');

  if (!refresh_token) return respond(prepare('UNAUTHORIZED'));

  const refresh_entry = refresh_tokens[refresh_token];
  const is_refresh_expired = !refresh_entry || refresh_entry.expires < elapse(0);

  if (!is_refresh_expired) return respond(prepare('UNAUTHORIZED'));

  const { access_token, refresh_token: new_refresh_token, expires } = await Token.generate(
    refresh_entry.user,
    refresh_entry.scope,
  );

  const new_refresh_entry = {
    user: refresh_entry.user,
    id: generate_ulid(),
    scope: refresh_entry.scope,
    expires: elapse(60 * 60 * 24 * 7),
  };

  const is_updated = await db.update(({ refresh_tokens }) => {
    delete refresh_tokens[refresh_token];
    refresh_tokens[new_refresh_token] = new_refresh_entry;
  });

  const response_content = is_updated
    ? { ...prepare('OK'), expires, access_token, refresh_token: new_refresh_token }
    : prepare('INTERNAL_ERROR');

  respond(response_content);
};
