import { useMemo } from "react"
import Head from "next/head"

import type { TimerLite, SerialisedTimer } from "../models/timer"
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
	serialisedTimers,
}: {
	serialisedTimers: SerialisedTimer[]
}): JSX.Element {
	const initialTimers = serialisedTimers.map(deSerialiseTimer)
	const Grid = useMemo(
		() => makeGridWithFilters(filterMap, initialFilter, initialTimers),
		[initialTimers]
	)

	return (
		<>
			<Head>
				<title>Countdown Timers | Dashboard</title>
			</Head>
			<Grid />
		</>
	)
}

// static props

import { GetStaticProps } from "next"

import { serialiseTimer } from "../lib/serialise"
import { getByEndTime } from "../models/timer"
import { deSerialiseTimer } from "../lib/serialise"

const msInWeek = 1000 * 60 * 60 * 24 * 7
export const getStaticProps: GetStaticProps = async () => {
	const oneWeekAgo = new Date(Date.now() - msInWeek)

	// get timers which ended in the last week or haven't yet finished
	const timersEndingSoon = await getByEndTime(oneWeekAgo)
	// if there aren't enough to populate the dashboard just get timers from the start of time
	const timers =
		timersEndingSoon.length < 9 ? await getByEndTime() : timersEndingSoon

	return {
		props: {
			serialisedTimers: timers.map(serialiseTimer),
		},
		revalidate: 60,
	}
}
