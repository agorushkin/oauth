import { fail, pass, type Result } from './result.ts';

export const intercept = async <A extends unknown[], R>(
  fn: (...args: A) => R,
  ...args: A
): Promise<Result<Awaited<R>>> => {
  try {
    const returned = fn(...args);
    const value = await Promise.resolve(returned);
    return pass(value);
  } catch (error) {
    return fail(error as Error);
  }
};
