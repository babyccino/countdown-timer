export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

type Extends<T, U extends T> = U
type Anyify<T> = { [P in keyof T]?: any }
export type Modify<T, R extends Anyify<T>> = Omit<T, keyof R> & R
export type Alg<T, R extends Partial<T>> = Omit<T, keyof R> & R

export type PickRename<T, K extends keyof T, R extends PropertyKey> = {
	[P in keyof T as P extends K ? R : P]: T[P]
}

export const capitalise = (word: string): string => word[0].toUpperCase() + word.slice(1)
