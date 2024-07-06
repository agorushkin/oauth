import type { Permission } from '/lib/data/types.ts';

type User = {
  salt: string;
  hash: string;
};

type RefreshToken = {
  user: string;
  id: string;
  scope: Permission[];
  expires: number;
};

type Code = {
  user: string;
  client: string;
  scope: Permission[];
  expires: number;
};

type Schema = {
  users: Record<string, User>;
  clients: Record<string, string>;
  refreshes: Record<string, RefreshToken>;
  flows: Record<string, Code>;
  blacklist: string[];
};

export const Schema: Schema = {
  users: {},
  clients: { test: '123' },
  refreshes: {},
  flows: {},
  blacklist: [],
};
