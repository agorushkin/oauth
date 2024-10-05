import type { ServerRequest } from 'x/http';
import type { Locals } from '/lib/data/types.ts';

export const perform_write = (
  response: ServerRequest<Locals>['response'],
  user: string,
) => {
  response.status = 200;
  response.body = `modified file as ${user}`;

  return true;
};
