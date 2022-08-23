export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

type Anyify<T> = { [P in keyof T]?: any };
export type Modify<T, R extends Anyify<T>> = Omit<T, keyof R> & R;
