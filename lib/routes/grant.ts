import type { Handler } from '/lib/data/types.ts';

import { Scope } from '/lib/src/auth/scope.ts';

import { generateCode } from '/lib/src/crypto/code.ts';
import { elapse } from '/lib/src/util/elapse.ts';
import { res } from '/lib/src/util/response.ts';
import { db } from '/lib/main.ts';

export const handler: Handler = async (
  { query, locals, responded, respond, redirect },
) => {
  if (responded) return;

  const { isAuthed, scope, user } = locals;
  const hasPermissionToGrant = isAuthed && user && scope?.includes('AUTH');

  if (!hasPermissionToGrant) {
    return respond(res('UNAUTHORIZED'));
  }

  const isValidQueryStructure = query.has('client') &&
    query.has('redirect') &&
    query.has('scope');

  if (!isValidQueryStructure) {
    return respond(res('INVALID_REQUEST'));
  }

  const client = query.get('client') ?? '';
  const target = query.get('redirect') ?? '';
  const grant = (query.get('scope') ?? '').split(',');

  const isValidQuery = client.length > 0 && target.length > 0 &&
    Scope.verify(grant);

  if (!isValidQuery) {
    return respond(res('INVALID_REQUEST'));
  }

  const clients = db.data?.clients;
  const isValidClient = client && clients[client];

  if (!isValidClient) {
    return respond(res('UNAUTHORIZED'));
  }

  const code = generateCode(4);

  const ok = await db.update(({ flows }) => {
    flows[code] = {
      client,
      user,
      scope: grant,
      expires: elapse(60 * 5),
    };
  });

  redirect(
    target + ok ? `?code=${code}` : '?error=server_error',
  );
};
