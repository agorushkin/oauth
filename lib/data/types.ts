import { Handler as HandleBase } from 'x/http';
import { PERMISSIONS } from '/lib/data/constants.ts';

export type Handler = HandleBase<Locals>;

export type Permission = keyof typeof PERMISSIONS;

export type Locals = {
  user: string;
  scope: Permission[];
  id: string;
  isAuthed: boolean;
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

export type TokenContent = {
  usr: string;
  scp: number;
  exp: number;
  jti: string;
};
