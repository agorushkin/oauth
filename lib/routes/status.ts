import type { Handler } from '/lib/data/types.ts';

export const handler: Handler = ({ responded, response, respond }) => {
  if (responded) return;

  response.status = 200;
  response.body = `VERSION: ${Deno.version.deno}; OS: ${Deno.build.os}`;

  respond();
};
