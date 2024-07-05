import type { ServerRequest } from 'x/http';
import type { Locals } from '/lib/data/types.ts';

export const exec = (
  response: ServerRequest<Locals>['response'],
  user: string,
) => {
  response.status = 200;
  response.body = `executed file as ${user}`;

  return true;
};
