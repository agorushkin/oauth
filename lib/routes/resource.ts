import type { Handler, Permission } from '/lib/data/types.ts';

import { match } from '/lib/utils/match.ts';
import { perform_read } from '/lib/actions/read.ts';
import { perform_write } from '/lib/actions/write.ts';
import { perform_exec } from '/lib/actions/exec.ts';
import { prepare } from '/lib/utils/response.ts';

export const handler: Handler = (
  { locals, params, respond, response, responded },
) => {
  if (responded) return;

  const { is_authed, scope, user } = locals;
  const is_valid_session = is_authed && user && scope;

  if (!is_valid_session) return;

  const action = (params.get('action') ?? '')
    .toUpperCase() as Permission;

  const has = scope.includes.bind(scope);

  const ok = match(action, {
    READ: () => has('READ') && perform_read(response, user),
    WRITE: () => has('WRITE') && perform_write(response, user),
    EXEC: () => has('EXEC') && perform_exec(response, user),
    AUTH: () => false,
    ADMIN: () => false,
    _: () => false,
  });

  const response_content = ok ? prepare('OK') : prepare('FORBIDDEN');

  respond(response_content);
};
