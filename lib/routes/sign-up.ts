import { Handler } from 'x/http';
import { AuthPayload } from '/lib/data/types.ts';

import { generateSalt } from '/lib/src/crypto/salt.ts';
import { hashPassword } from '/lib/src/crypto/hash.ts';
import { res } from '/lib/src/util/response.ts';
import { db } from '/lib/main.ts';

export const handler: Handler = async (
  { json, responded, respond },
) => {
  if (responded) return;

  const users = db.data?.users;
  const data = await json<AuthPayload>()
    .catch(() => null);

  const isPayloadValid = data &&
    typeof data?.name === 'string' &&
    typeof data?.password === 'string';

  if (!isPayloadValid) {
    return respond(res('INVALID_PAYLOAD'));
  }

  const { name, password } = data;
  const isNameValid = /^[A-Za-z]{3,12}$/.test(name);
  const isPasswordValid = /^[A-Za-z0-9!@#$%^&*()_+]{8,32}$/.test(password);

  if (!isNameValid) {
    return respond(res('INVALID_NAME'));
  }

  if (!isPasswordValid) {
    return respond(res('INVALID_PASSWORD'));
  }

  const isConflictPresent = users && users[name];

  if (isConflictPresent) {
    return respond(res('CONFLICT'));
  }

  const isUpdated = await db.update(async ({ users }) => {
    const salt = generateSalt();
    const hash = await hashPassword(password, salt);

    users[data.name] = {
      hash,
      salt,
    };
  });

  respond(isUpdated ? res('CREATED') : res('INTERNAL_ERROR'));
};
