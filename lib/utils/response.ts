import type { ServerResponse } from 'x/http';

import { RESPONSES } from '../data/constants.ts';

export const prepare = (
  type: keyof typeof RESPONSES,
  response?: ServerResponse,
) => {
  if (!response) return RESPONSES[type];

  response.status = RESPONSES[type].status;
  response.body = RESPONSES[type].body;
};
