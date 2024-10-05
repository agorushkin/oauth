import { Handler as HandleBase } from 'x/http';
import { PERMISSIONS } from '/lib/data/constants.ts';

export type Handler = HandleBase<Locals>;

export type Permission = keyof typeof PERMISSIONS;

export type Locals = {
  user: string;
  scope: Permission[];
  id: string;
  is_authed: boolean;
};

export type AuthPayload = {
  name: string;
  password: string;
};

export type ExchangePayload = {
  code: string;
  agent: string;
  secret: string;
};

export type TokenContent = {
  usr: string;
  scp: number;
  exp: number;
  jti: string;
};
