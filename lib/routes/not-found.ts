import type { Handler } from 'x/http';

import { res } from '/lib/src/util/response.ts';

export const handler: Handler = ({ responded, response }) => {
  if (responded) return;

  res('NOT_FOUND', response);
};
