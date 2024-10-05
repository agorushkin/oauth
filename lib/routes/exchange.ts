import type { Handler } from 'x/http';
import type { ExchangePayload } from '/lib/data/types.ts';

import { Token } from '/lib/auth/token.ts';

import { db } from '/main.ts';
import { elapse } from '/lib/utils/elapse.ts';
import { generate_ulid } from '/lib/crypto/ulid.ts';
import { prepare } from '/lib/utils/response.ts';

export const handler: Handler = async (
  { json, respond, responded },
) => {
  if (responded) return;

  const agents = db.data.agents;
  const exchange_flows = db.data.exchange_flows;
  const exchange_data = await json<ExchangePayload>()
    .catch(() => null);

  const is_payload_valid = !!exchange_data &&
    typeof exchange_data.code === 'string' &&
    typeof exchange_data.agent === 'string' &&
    typeof exchange_data.secret === 'string';

  if (!is_payload_valid) return respond(prepare('INVALID_PAYLOAD'));

  const { code, agent, secret } = exchange_data;

  const is_auth_valid = agents &&
    exchange_flows &&
    agents[agent] === secret &&
    exchange_flows[code].agent === agent &&
    exchange_flows[code].expires > Date.now();

  if (!is_auth_valid) return respond(prepare('UNAUTHORIZED'));

  const { user, scope } = exchange_flows[code];

  const {
    access_token,
    refresh_token,
    expires,
  } = await Token.generate(user, scope);

  const refresh_entry = {
    user,
    id: generate_ulid(),
    scope,
    expires: elapse(60 * 60),
  };

  const is_updated = await db.update(({ refresh_tokens, exchange_flows }) => {
    delete exchange_flows[code];
    refresh_tokens[refresh_token] = refresh_entry;
  });

  const response_content = is_updated
    ? { ...prepare('OK'), body: JSON.stringify({ access_token, refresh_token, expires }) }
    : prepare('INTERNAL_ERROR');

  respond(response_content);
};
