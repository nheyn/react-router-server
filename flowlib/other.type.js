type MaybePromise<T> = Promise<T> | T;
type GetMaybePromise<T> = () => MaybePromise<T>;