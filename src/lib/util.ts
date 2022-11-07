import { objectEnumValues } from "@prisma/client/runtime"
import axios from "axios"

import { Timer } from "@/models/timer"

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

type Anyify<T> = { [P in keyof T]?: any }
export type Modify<T, R extends Anyify<T>> = Omit<T, keyof R> & R

export type PickRename<T, K extends keyof T, R extends PropertyKey> = {
	[P in keyof T as P extends K ? R : P]: T[P]
}

export const capitalise = (word: string): string =>
	word[0].toUpperCase() + word.slice(1)

type Query = { [query: string]: string | undefined }

export function makeQueryString(query: Query) {
	return Object.entries(query).reduce<string>((prev, curr, i) => {
		if (curr[1] === undefined) return prev

		const [key, val] = curr
		const currQuery = `${key}=${val}`

		if (i === 0) return currQuery
		return `${prev}&${currQuery}`
	}, "")
}

export async function getTimersFromApiServer(query: Query): Promise<Timer[]> {
	return (await axios.get(`/api/timers?${makeQueryString(query)}`)).data.timers
}
