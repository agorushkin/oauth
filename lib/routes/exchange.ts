import type { Handler } from 'x/http';
import type { ExchangePayload } from '/lib/data/types.ts';

import { Token } from '/lib/src/auth/token.ts';

import { generateULID } from '/lib/src/crypto/ulid.ts';
import { elapse } from '/lib/src/util/elapse.ts';
import { res } from '/lib/src/util/response.ts';
import { db } from '/lib/main.ts';

export const handler: Handler = async (
  { json, responded, response, respond },
) => {
  if (responded) return;

  const data = await json<ExchangePayload>()
    .catch(() => null);

  const isPayloadValid = !!data &&
    typeof data.code === 'string' &&
    typeof data.client === 'string' &&
    typeof data.secret === 'string';

  if (!isPayloadValid) {
    res('INVALID_PAYLOAD', response);

    return respond();
  }

  const { code, client, secret } = data;

  const flows = db.data.flows;
  const clients = db.data.clients;

  const isAuthFlowValid = flows && clients &&
    clients[client] === secret &&
    flows[code].client === client &&
    flows[code].expires > Date.now();

  if (!isAuthFlowValid) {
    res('UNAUTHORIZED', response);

    return respond();
  }

  const { user, scope } = flows[code];

  const {
    token,
    refresh,
    expires,
  } = await Token.generate(user, scope);

  const isUpdated = await db.update(({ refreshes, flows }) => {
    delete flows[code];

    refreshes[refresh] = {
      user,
      id: generateULID(),
      scope,
      expires: elapse(60 * 60 * 24 * 90),
    };
  });

  respond(
    isUpdated
      ? { ...res('OK'), body: JSON.stringify({ token, refresh, expires }) }
      : res('INTERNAL_ERROR'),
  );
};
