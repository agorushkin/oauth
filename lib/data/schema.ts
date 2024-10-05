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
  agent: string;
  scope: Permission[];
  expires: number;
};

type Schema = {
  users: Record<string, User>;
  agents: Record<string, string>;
  refresh_tokens: Record<string, RefreshToken>;
  exchange_flows: Record<string, Code>;
  token_blacklist: string[];
};

export const Schema: Schema = {
  users: {},
  agents: {},
  refresh_tokens: {},
  exchange_flows: {},
  token_blacklist: [],
};
