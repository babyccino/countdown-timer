import { useMemo } from "react"
import Head from "next/head"

import { makeGridWithFilters, FilterMap } from "../components/grid"
import { getTimersFromApiServer } from "../lib/util"

const getNewTimersByEndDate = (offset?: string): Promise<TimerLite[]> =>
	getTimersFromApiServer({ sort: "enddate", offset })
const initialFilter = "Default"
const filterMap = new FilterMap([
	[
		initialFilter,
		{
			getNewTimers: getNewTimersByEndDate,
			getTimerOffset: (timer: TimerLite): string =>
				new Date(timer.endTime).toISOString(),
		},
	],
	[
		"End date",
		{
			getNewTimers: getNewTimersByEndDate,
			getTimerOffset: (timer: TimerLite): string =>
				new Date(timer.endTime).toISOString(),
		},
	],
	[
		"Created at",
		{
			getNewTimers: async (offset?: string): Promise<TimerLite[]> =>
				getTimersFromApiServer({ sort: "created", offset }),
			getTimerOffset: (timer: TimerLite): string =>
				new Date(timer.createdAt).toISOString(),
		},
	],
])

export default function Index({
	initialTimers,
}: {
	initialTimers: TimerLite[]
}): JSX.Element {
	const Grid = useMemo(
		() => makeGridWithFilters(filterMap, initialFilter, initialTimers),
		[initialTimers]
	)

	return (
		<>
			<Head>
				<title>Dashboard</title>
			</Head>
			<Grid />
		</>
	)
}

// static props

import { GetStaticProps } from "next"

import { getByEndTime, TimerLite } from "../models/timer"

const msInWeek = 1000 * 60 * 60 * 24 * 7
export const getStaticProps: GetStaticProps = async () => {
	const oneWeekAgo = new Date(Date.now() - msInWeek)
	const timers = await getByEndTime(oneWeekAgo)

	return {
		props: {
			initialTimers: timers.map((timer) => ({
				...timer,
				endTime: (timer.endTime as Date).toISOString(),
				createdAt: (timer.createdAt as Date).toISOString(),
			})),
		},
		revalidate: 60,
	}
}
