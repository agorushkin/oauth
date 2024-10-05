import type { AuthPayload, Handler } from '/lib/data/types.ts';

import { db } from '/main.ts';
import { generate_salt } from '/lib/crypto/salt.ts';
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

  const { name, password } = auth_data;
  const is_name_valid = /^[A-Za-z]{3,12}$/.test(name);
  const is_password_valid = /^[A-Za-z0-9!@#$%^&*()_+]{8,32}$/.test(password);

  if (!is_name_valid) return respond(prepare('INVALID_NAME'));
  if (!is_password_valid) return respond(prepare('INVALID_PASSWORD'));

  const is_conflict_present = users && users[name];

  if (is_conflict_present) return respond(prepare('CONFLICT'));

  const is_updated = await db.update(async ({ users }) => {
    const salt = generate_salt();
    const hash = await hash_password(password, salt);

    users[auth_data.name] = {
      hash,
      salt,
    };
  });

  const response_content = is_updated ? prepare('CREATED') : prepare('INTERNAL_ERROR');

  respond(response_content);
};
