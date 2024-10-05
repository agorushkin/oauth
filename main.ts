import Config from './config/config.json' with { type: 'json' };

import { Schema } from '/lib/data/schema.ts';
import { Locals } from '/lib/data/types.ts';

import { Server } from 'x/http';
import { DB } from '/lib/db.ts';

import { handler as handle_resource_request } from '/lib/routes/resource.ts';
import { handler as handle_status_request } from '/lib/routes/status.ts';

import { handler as handle_signup } from '/lib/routes/sign_up.ts';
import { handler as handle_signin } from '/lib/routes/sign_in.ts';

import { handler as handle_grant } from '/lib/routes/grant.ts';
import { handler as handle_exchange } from '/lib/routes/exchange.ts';
import { handler as handle_refresh } from '/lib/routes/refresh.ts';

import { handler as handle_authorization } from '/lib/routes/authenticate.ts';
import { handler as handle_not_found } from '/lib/routes/not_found.ts';

export const server = new Server<Locals>();
export const db = new DB('./data.json', Schema);

await db.read();

server.use(handle_authorization);

server.get('/status', handle_status_request);
server.get('/resource/:action', handle_resource_request);

// User Authentication

server.post('/sign-up', handle_signup);
server.post('/sign-in', handle_signin);

// Third Party Authentication

server.get('/grant', handle_grant);
server.post('/exchange', handle_exchange);
server.post('/refresh', handle_refresh);

server.use(handle_not_found);

const tls = Config.tls.key.length && Config.tls.cert.length
  ? { key: Config.tls.key, cert: Config.tls.cert }
  : undefined;

server.listen({
  port: Config.port,
  tls,
});
