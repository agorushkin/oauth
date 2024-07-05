import { Handler } from 'x/http';

export const handler: Handler = ({ responded, response, respond }) => {
  if (responded) return;

  response.status = 200;
  response.body = `running on ${Deno.build.os}`;

  respond();
};
