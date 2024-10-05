import type { Handler } from '/lib/data/types.ts';

import { prepare } from '/lib/utils/response.ts';

export const handler: Handler = ({ response, responded }) => {
  if (responded) return;

  prepare('NOT_FOUND', response);
};
