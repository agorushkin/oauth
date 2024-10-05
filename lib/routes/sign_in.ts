import type { AuthPayload, Handler, Permission } from '/lib/data/types.ts';

import { Token } from '/lib/auth/token.ts';

import { db } from '/main.ts';
import { elapse } from '/lib/utils/elapse.ts';
import { generate_ulid } from '/lib/crypto/ulid.ts';
import { hash_password } from '/lib/crypto/hash.ts';
import { prepare } from '/lib/utils/response.ts';

export const handler: Handler = async (
  { json, respond, responded },
) => {
  if (responded) return;

  const users = db.data?.users;
  const auth_data = await json<AuthPayload>()
    .catch(() => null);

  const is_payload_valid = auth_data &&
    typeof auth_data?.name === 'string' &&
    typeof auth_data?.password === 'string';

  if (!is_payload_valid) return respond(prepare('INVALID_PAYLOAD'));

  const is_user_valid = users && auth_data.name in users;

  if (!is_user_valid) return respond(prepare('UNAUTHORIZED'));

  const name = auth_data.name;
  const user = db.data.users[name];
  const hash = await hash_password(auth_data.password, user.salt);

  if (hash !== user.hash) return respond(prepare('UNAUTHORIZED'));

  const scope = ['READ', 'WRITE', 'EXEC', 'AUTH'] as Permission[];
  const {
    expires,
    refresh_token,
    access_token,
  } = await Token.generate(
    name,
    scope,
  );

  const new_refresh_token_entry = {
    user: name,
    id: generate_ulid(),
    scope,
    expires: elapse(60 * 60 * 24 * 90),
  };

  const is_updated = await db.update(({ refresh_tokens }) => {
    refresh_tokens[refresh_token] = new_refresh_token_entry;
  });

  const response_content = is_updated
    ? { ...prepare('OK'), body: JSON.stringify({ expires, refresh_token, access_token }) }
    : prepare('INTERNAL_ERROR');

  respond(response_content);
};
