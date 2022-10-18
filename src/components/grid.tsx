import React, { useRef, useState } from "react"

import { TimerLite } from "../models/timer"
import { dateDifference } from "../lib/date"
import { useAtPageBottom } from "../lib/hooks"

import Timer from "../components/timer"

type GetNewTimerCallback = (offset?: string) => Promise<TimerLite[]>
type GetTimerOffsetCallback = (timer: TimerLite) => string

export class FilterMap extends Map<
	string,
	{
		getNewTimers: GetNewTimerCallback
		getTimerOffset: GetTimerOffsetCallback
	}
> {}

export function makeGridWithFilters(
	filterMap: FilterMap,
	initialFilter: string,
	initialTimers: TimerLite[]
): () => JSX.Element {
	const filterList: string[] = Array.from(filterMap.keys())
	const initialOffset = initialTimers.at(-1)?.endTime.toISOString()

	return function GridWithFilters(): JSX.Element {
		const [filter, setFilter] = useState<string>(initialFilter)
		const isInitialFilter = filter === initialFilter

		// if the the initial filter is selected but there is no initial timers list
		// then display message saying there are no timers
		if (isInitialFilter && !initialOffset) {
			return <div>No timers found</div>
		}

		const entry = filterMap.get(filter)
		if (!entry) throw new RangeError("selected filter does not exist")
		const { getNewTimers, getTimerOffset } = entry

		const offset = isInitialFilter ? (initialOffset as string) : undefined

		const InfiniteScrollGrid = withInfiniteScroll(
			PlainGrid,
			getNewTimers,
			getTimerOffset,
			offset
		)

		return (
			<>
				<form>
					<label>Sort by:</label>
					<select onChange={(e) => setFilter(e.target.value)}>
						{filterList.map((filterName) => (
							<option
								defaultChecked={filterName === initialFilter}
								value={filterName}
								key={filterName}
							>
								{filterName}
							</option>
						))}
					</select>
				</form>

				{isInitialFilter ? <PlainGrid timers={initialTimers} /> : null}

				<InfiniteScrollGrid />
			</>
		)
	}
}

export function withInfiniteScroll(
	GridComponent: ({ timers }: { timers: TimerLite[] }) => JSX.Element,
	getNewTimers: GetNewTimerCallback,
	getTimerOffset: GetTimerOffsetCallback,
	initialOffset?: string
): () => JSX.Element {
	return function TimerGrid(): JSX.Element {
		const [timers, setTimers] = useState<TimerLite[]>([])
		const loadingTimers = useRef(false)
		const reachedEnd = useRef(false)

		useAtPageBottom(
			async () => {
				if (loadingTimers.current || reachedEnd.current) return

				loadingTimers.current = true
				const fetchedTimers: TimerLite[] = await (async () => {
					if (timers.length > 0)
						return getNewTimers(getTimerOffset(timers.at(-1) as TimerLite))
					if (initialOffset) return getNewTimers(initialOffset)
					return getNewTimers()
				})()

				if (fetchedTimers.length !== 0) {
					setTimers((prev: TimerLite[]) =>
						prev.concat(fetchedTimers as TimerLite[])
					)
				}

				if (fetchedTimers.length < 9) reachedEnd.current = true

				loadingTimers.current = false
			},
			10,
			[timers]
		)

		return <GridComponent timers={timers} />
	}
}

export function PlainGrid({ timers }: { timers: TimerLite[] }): JSX.Element {
	return (
		<div className="w-full md:grid grid-cols-3 gap-6 px-4 md:px-8 pt-6">
			{timers.map(({ title, endTime, id }: TimerLite): JSX.Element => {
				if (id === undefined) throw new Error("[Next.js] timer id undefined")

				const diff = dateDifference(new Date(endTime))
				const props = { title, diff, id }

				return (
					<div key={id}>
						<Timer {...props} preview />
					</div>
				)
			})}
		</div>
	)
}
