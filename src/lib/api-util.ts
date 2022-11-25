import axios from "axios"

import type { Timer } from "@/models/timer"
import ServerError from "./error"
import { Modify } from "./util"

export type SerialisedTimer = Modify<Timer, { endTime: string; createdAt: string }>

export const serialiseTimer = (timer: Timer): SerialisedTimer => ({
	...timer,
	endTime: timer.endTime.toISOString(),
	createdAt: timer.createdAt.toISOString(),
})
export const deSerialiseTimer = (timer: SerialisedTimer): Timer => ({
	...timer,
	endTime: new Date(timer.endTime),
	createdAt: new Date(timer.createdAt),
})

export type Sort = "enddate" | "created"
type Query = { sort: Sort; offset?: string; userid?: string }

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
	return (await axios.get<{ timers: Timer[] }>(`/api/timers?${makeQueryString(query)}`)).data.timers
}

export function checkValidSort(sort: string): asserts sort is "enddate" | "created" {
	if (!(sort === "enddate" || sort === "created"))
		throw new ServerError("Sort type is invalid", 400)
}
