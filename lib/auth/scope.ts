import type { Permission } from '/lib/data/types.ts';

import { PERMISSIONS } from '/lib/data/constants.ts';

export class Scope {
  static from = (
    permissions: Permission[],
  ) => permissions.reduce((acc, p) => acc | PERMISSIONS[p], 0);

  static parse = (scope: number) => {
    const permissions = Object.keys(PERMISSIONS) as Permission[];
    return permissions.filter((p) => scope & PERMISSIONS[p]);
  };

  static verify = (permissions: string[]): permissions is Permission[] => {
    const valid = Object.keys(PERMISSIONS) as Permission[];
    return permissions.every((p) => valid.includes(p as Permission));
  };
}
