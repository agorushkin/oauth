type User = {
  salt: string;
  hash: string;
};

type RefreshToken = {
  user: string;
  expires: number;
  token: string;
  scope: number;
};

type Code = {
  user: string;
  client: string;
  expires: number;
  scope: number;
};

type Schema = {
  users: Record<string, User>;
  clients: Record<string, string>;
  refreshes: Record<string, RefreshToken>;
  codes: Record<string, Code>;
  invalid: string[];
};

export const Schema: Schema = {
  users: {},
  clients: {
    test: '123',
  },
  refreshes: {},
  codes: {},
  invalid: [],
};
