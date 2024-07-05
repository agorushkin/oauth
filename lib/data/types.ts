import { Handler as HandleBase } from 'x/http';
import { PERMISSIONS } from '/lib/data/consts.ts';

export type Handler = HandleBase<Locals>;

export type Locals = {
  user: string;
  scope: (keyof typeof PERMISSIONS)[];
  authed: boolean;
};

export type AuthPayload = {
  name: string;
  password: string;
};

export type ExchangePayload = {
  code: string;
  client: string;
  secret: string;
};

export type JWTPayload = {
  usr: string;
  scp: number;
  exp: number;
};
