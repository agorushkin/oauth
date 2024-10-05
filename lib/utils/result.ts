export type Passed<T> = { ok: true; value: T; error: undefined };
export type Failed<E> = { ok: false; value: undefined; error: E };
export type Result<T, E = Error> = Passed<T> | Failed<E>;

export const pass = <T>(value: T): Passed<T> => ({
  ok: true,
  value,
  error: undefined,
});
export const fail = <E>(error: E): Failed<E> => ({
  ok: false,
  value: undefined,
  error,
});
