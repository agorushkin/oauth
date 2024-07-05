export const match = <T extends string, R = void>(
  value: T,
  pattern: Record<T, (value: T) => R> & { '_': (value: T) => R },
): R => {
  const match = pattern?.[value];

  return match ? match(value) : pattern['_'](value);
};
