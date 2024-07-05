type Result<T, E = Error> = {
  ok: true;
  value: T;
  error: null;
} | {
  ok: false;
  value: null;
  error: E;
};

export const guard = async <A extends unknown[], R>(
  fn: (...args: A) => R,
  ...args: A
): Promise<Result<Awaited<R>>> => {
  try {
    const returned = fn(...args);
    const value = await Promise.resolve(returned);
    return { ok: true, value, error: null };
  } catch (error) {
    return { ok: false, value: null, error };
  }
};
