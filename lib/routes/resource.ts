import type { PERMISSIONS } from '/lib/data/consts.ts';
import type { Handler } from '/lib/data/types.ts';

import { match } from '/lib/src/util/match.ts';
import { read } from '/lib/src/actions/read.ts';
import { write } from '/lib/src/actions/write.ts';
import { exec } from '/lib/src/actions/exec.ts';
import { res } from '/lib/src/util/response.ts';

export const handler: Handler = (
  { locals, params, responded, response, respond },
) => {
  if (responded) return;

  const { authed, scope, user } = locals;

  if (!authed || !user || !scope) return;

  const action = (params.get('action') ?? '')
    .toUpperCase() as keyof typeof PERMISSIONS;

  const has = scope.includes.bind(scope);

  const ok = match(action, {
    READ: () => has('READ') && read(response, user),
    WRITE: () => has('WRITE') && write(response, user),
    EXEC: () => has('EXEC') && exec(response, user),
    AUTH: () => false,
    ADMIN: () => false,
    _: () => false,
  });

  if (!ok) {
    res('FORBIDDEN', response);
  }

  respond();
};
