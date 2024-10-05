import type { Handler, Permission } from '/lib/data/types.ts';

import { Scope } from '/lib/auth/scope.ts';

import { db } from '/main.ts';
import { elapse } from '/lib/utils/elapse.ts';
import { generate_code } from '/lib/crypto/code.ts';
import { prepare } from '/lib/utils/response.ts';

export const handler: Handler = async (
  { query, locals, redirect, respond, responded },
) => {
  if (responded) return;

  const agents = db.data?.agents;
  const { is_authed, scope, user } = locals;
  const has_permission_to_grant = is_authed && user && scope?.includes('AUTH');

  if (!has_permission_to_grant) return respond(prepare('UNAUTHORIZED'));

  const is_valid_query_structure = query.has('client') &&
    query.has('redirect') &&
    query.has('scope');

  if (!is_valid_query_structure) return respond(prepare('INVALID_REQUEST'));

  const agent = query.get('agent') ?? '';
  const target_url = query.get('redirect') ?? '';
  const grant_scope = (query.get('scope') ?? '').split(',') as Permission[];

  const is_valid_query = agent.length > 0 &&
    target_url.length > 0 &&
    Scope.verify(grant_scope);

  if (!is_valid_query) return respond(prepare('INVALID_REQUEST'));

  const is_valid_client = agent.length && agents[agent];

  if (!is_valid_client) return respond(prepare('UNAUTHORIZED'));

  const code = generate_code(4);
  const exchange_flow_entry = {
    agent,
    user,
    scope: grant_scope,
    expires: elapse(60 * 5),
  };

  const is_updated = await db.update(({ exchange_flows }) => {
    exchange_flows[code] = exchange_flow_entry;
  });

  // If you read this, you found an easter egg! 🥚
  // Please email me at arsenii.gorushkin@gmail.com saying that you found it!
  const final_destination = `${target_url}${is_updated ? `?code=${code}` : '?error=server_error'}`;
  redirect(final_destination);
};
