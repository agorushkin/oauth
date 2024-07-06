import Config from '/lib/config/config.json' with { type: 'json' };

import { Schema } from '/lib/data/schema.ts';
import { Locals } from '/lib/data/types.ts';

import { Server } from 'x/http';
import { DB } from '/lib/src/db.ts';

import { handler as handleResourceRequest } from '/lib/routes/resource.ts';
import { handler as handleStatusRequest } from '/lib/routes/status.ts';

import { handler as handleSignUp } from '/lib/routes/sign-up.ts';
import { handler as handleSignIn } from '/lib/routes/sign-in.ts';

import { handler as handleGrant } from '/lib/routes/grant.ts';
import { handler as handleExchange } from '/lib/routes/exchange.ts';
import { handler as handleRefresh } from '/lib/routes/refresh.ts';

import { handler as handleAuthorization } from './routes/authenticate.ts';
import { handler as handleNotFound } from '/lib/routes/not-found.ts';

export const server = new Server<Locals>();
export const db = new DB('./lib/data/data.json', Schema);

await db.read();

server.use(handleAuthorization);

server.get('/status', handleStatusRequest);
server.get('/resource/:action', handleResourceRequest);

// User Authentication

server.post('/sign-up', handleSignUp);
server.post('/sign-in', handleSignIn);

// Third Party Authentication

server.get('/grant', handleGrant);
server.post('/exchange', handleExchange);
server.post('/refresh', handleRefresh);

server.use(handleNotFound);

server.listen({
  port: Config.port,
});
