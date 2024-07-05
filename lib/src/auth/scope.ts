import { PERMISSIONS } from '/lib/data/consts.ts';

export const calculateScope = (
  permissions: (keyof typeof PERMISSIONS)[],
) => permissions.reduce((acc, p) => acc | PERMISSIONS[p], 0);

export const parseScope = (scope: number) => {
  const permissions = Object.keys(PERMISSIONS) as (keyof typeof PERMISSIONS)[];
  return permissions.filter((p) => scope & PERMISSIONS[p]);
};
