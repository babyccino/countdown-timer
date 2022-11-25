import { useMemo } from "react"
import Head from "next/head"

import { makeGridWithFilters, FilterMap, GetNewTimerCallback } from "@/components/grid"
import { getTimersFromApiServer, SerialisedTimer, deSerialiseTimer } from "@/lib/api-util"

const getNewTimersByEndDate: GetNewTimerCallback = (offset?) =>
	getTimersFromApiServer({ sort: "enddate", offset })
const initialFilter = "Default"
const filterMap = new FilterMap([
	[
		initialFilter,
		{
			getNewTimers: getNewTimersByEndDate,
			getTimerOffset: (timer) => new Date(timer.endTime).toISOString(),
		},
	],
	[
		"End date",
		{
			getNewTimers: getNewTimersByEndDate,
			getTimerOffset: (timer) => new Date(timer.endTime).toISOString(),
		},
	],
	[
		"Created at",
		{
			getNewTimers: async (offset?) => getTimersFromApiServer({ sort: "created", offset }),
			getTimerOffset: (timer) => new Date(timer.createdAt).toISOString(),
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

import { getPublicTimers } from "@/models/timer"
import { serialiseTimer } from "@/lib/api-util"

const msInWeek = 1000 * 60 * 60 * 24 * 7
export const getStaticProps: GetStaticProps = async () => {
	const oneWeekAgo = new Date(Date.now() - msInWeek)

	// get timers which ended in the last week or haven't yet finished
	const timersEndingSoon = await getPublicTimers("enddate", oneWeekAgo)
	// if there aren't enough to populate the dashboard just get timers from the start of time
	const timers = timersEndingSoon.length < 9 ? await getPublicTimers("enddate") : timersEndingSoon

	return {
		props: {
			serialisedTimers: timers.map(serialiseTimer),
		},
		revalidate: 60,
	}
}
