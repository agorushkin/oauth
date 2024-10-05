import type { Handler } from '/lib/data/types.ts';

import { Scope } from '/lib/auth/scope.ts';
import { Token } from '/lib/auth/token.ts';

import { db } from '/main.ts';
import { elapse } from '/lib/utils/elapse.ts';
import { prepare } from '/lib/utils/response.ts';

export const handler: Handler = async (
  { headers, locals, responded },
) => {
  if (responded) return;

  locals.is_authed = false;

  const users = db.data?.users;
  const token_blacklist = db.data?.token_blacklist || [];

  const header = headers.get('authorization');
  const is_header_valid = header && header.startsWith('Bearer ');

  if (!is_header_valid) return prepare('UNAUTHORIZED');

  const access_token = header.replace('Bearer ', '');
  const is_token_valid = access_token.length > 0;

  if (!is_token_valid) return prepare('UNAUTHORIZED');

  const payload = await Token.parse(access_token);

  const is_payload_valid = payload !== null;
  const is_token_expired = !is_payload_valid || payload.exp < elapse(0);
  const is_token_blacklisted = !is_payload_valid || token_blacklist.includes(payload.jti);

  const is_token_actual = !is_token_expired && !is_token_blacklisted;

  if (!is_token_actual) return prepare('UNAUTHORIZED');

  const is_user_actual = users && payload.usr in users;

  if (!is_user_actual) return prepare('UNAUTHORIZED');

  const scope = Scope.parse(payload.scp);

  locals.user = payload.usr;
  locals.scope = scope;
  locals.is_authed = true;
  locals.id = payload.jti;
};
