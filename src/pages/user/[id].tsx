import { useMemo } from "react"
import Head from "next/head"

import type { TimerLite, SerialisedTimer } from "@/models/timer"
import { deSerialiseTimer } from "@/lib/serialise"
import { getTimersFromApiServer } from "@/lib/util"
import { makeGridWithFilters, FilterMap } from "@/components/grid"

export default function UserPage({
	serialisedTimers,
	user,
}: {
	serialisedTimers: SerialisedTimer[]
	user: User
}): JSX.Element {
	const initialTimers = serialisedTimers.map(deSerialiseTimer)
	const Grid = useMemo(() => {
		const initialFilter = "Default (end date)"
		const filterMap = new FilterMap([
			[
				initialFilter,
				{
					getNewTimers: (offset?: string): Promise<TimerLite[]> =>
						getTimersFromApiServer({
							offset,
							userid: user.id,
							sort: "enddate",
						}),
					getTimerOffset: (timer: TimerLite): string =>
						new Date(timer.endTime).toISOString(),
				},
			],
			[
				"Created at",
				{
					getNewTimers: (offset?: string): Promise<TimerLite[]> =>
						getTimersFromApiServer({
							offset,
							userid: user.id,
							sort: "created",
						}),
					getTimerOffset: (timer: TimerLite): string =>
						new Date(timer.createdAt).toISOString(),
				},
			],
		])

		return makeGridWithFilters(filterMap, initialFilter, initialTimers)
	}, [initialTimers, user])

	return (
		<>
			<Head>
				<title>{`Countdown timer | ${user.displayName}'s timers`}</title>
			</Head>
			<div
				style={{
					gridTemplateAreas: `
						'title title sort'
						'main main main'
						'main main main'
					`,
				}}
				className="sm:grid sm:grid-cols-3"
			>
				<div
					style={{ gridArea: "title" }}
					className="flex justify-center items-center"
				>
					<h1 className="text-3xl font-['Montserrat'] font-medium py-4 sm:py-0">
						{user.displayName}&apos;s Timers
					</h1>
				</div>
				<Grid />
			</div>
		</>
	)
}

// static props

import { GetStaticProps, GetStaticPaths } from "next"

import { getFromUserByEndTime } from "@/models/timer"
import { findById, getAllIds, User } from "@/models/user"
import { serialiseTimer } from "@/lib/serialise"

export const getStaticPaths: GetStaticPaths = async () => {
	const ids = await getAllIds()
	const paths = ids.map((id) => ({ params: { id } }))

	return {
		paths,
		fallback: "blocking",
	}
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	console.log(`[Next.js] running getStaticProps on path /user/${params?.id}`)
	if (
		params === undefined ||
		params.id === "undefined" ||
		Array.isArray(params.id) ||
		params.id === undefined
	) {
		return { notFound: true }
	}

	const userId = params.id
	const [timers, user] = await Promise.all([
		getFromUserByEndTime(userId),
		findById(userId),
	])
	if (!user) {
		console.log(`[Next.js] path ${params.id} not found`)
		return { notFound: true }
	}

	return {
		props: {
			serialisedTimers: timers.map(serialiseTimer),
			user,
		},
	}
}
