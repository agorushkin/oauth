import type { ServerRequest } from 'x/http';
import type { Locals } from '/lib/data/types.ts';

export const perform_read = (
  response: ServerRequest<Locals>['response'],
  user: string,
) => {
  response.status = 200;
  response.body = `accessed file as ${user}`;

  return true;
};
