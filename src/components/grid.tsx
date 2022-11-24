import React, { useRef, useState } from "react"

import { Timer } from "@/models/timer"
import { dateDifference } from "@/lib/date"
import { useAtPageBottom } from "@/lib/hooks"
import { Timer as TimerComponent } from "@/components/timer"

export type GetNewTimerCallback = (offset?: string) => Promise<Timer[]>
export type GetTimerOffsetCallback = (timer: Timer) => string

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
	initialTimers: Timer[]
): () => JSX.Element {
	const filterList: string[] = Array.from(filterMap.keys())
	const initialOffset = initialTimers.at(-1)?.endTime.toISOString()

	return function GridWithFilters(): JSX.Element {
		const [filter, setFilter] = useState<string>(initialFilter)
		const isInitialFilter = filter === initialFilter

		// if the the initial filter is selected but there is no initial timers list
		// then display message saying there are no timers
		if (isInitialFilter && !initialOffset) {
			return <div className="text-center text-xl pt-6">No timers found</div>
		}

		const entry = filterMap.get(filter)
		if (!entry) throw new RangeError("selected filter does not exist")
		const { getNewTimers, getTimerOffset } = entry

		const offset = isInitialFilter ? (initialOffset as string) : undefined

		const InfiniteScrollGrid = withInfiniteScroll(PlainGrid, getNewTimers, getTimerOffset, offset)

		return (
			<>
				<form className="flex flex-row justify-center items-baseline pt-2 gap-4">
					<label className="mb-2 text-sm font-medium text-gray-900">Sort by</label>
					<select
						onChange={(e) => setFilter(e.target.value)}
						className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
					>
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
	GridComponent: ({ timers }: { timers: Timer[] }) => JSX.Element,
	getNewTimers: GetNewTimerCallback,
	getTimerOffset: GetTimerOffsetCallback,
	initialOffset?: string
): () => JSX.Element {
	return function TimerGrid(): JSX.Element {
		const [timers, setTimers] = useState<Timer[]>([])
		const loadingTimers = useRef(false)
		const reachedEnd = useRef(false)

		useAtPageBottom(
			async () => {
				if (loadingTimers.current || reachedEnd.current) return

				loadingTimers.current = true
				const fetchedTimers: Timer[] = await (async () => {
					if (timers.length > 0) return getNewTimers(getTimerOffset(timers.at(-1) as Timer))
					if (initialOffset) return getNewTimers(initialOffset)
					return getNewTimers()
				})()

				if (fetchedTimers.length !== 0) {
					setTimers((prev: Timer[]) => prev.concat(fetchedTimers as Timer[]))
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

export function PlainGrid({ timers }: { timers: Timer[] }): JSX.Element {
	return (
		<div
			style={{ gridArea: "main" }}
			className="w-full md:grid grid-cols-3 gap-6 px-4 md:px-8 pt-4"
		>
			{timers.map((timer: Timer): JSX.Element => {
				if (timer.id === undefined) throw new Error("[Next.js] timer id undefined")

				const diff = dateDifference(new Date(timer.endTime))
				const props = {
					...timer,
					displayName: timer.user.displayName,
					userId: timer.user.id,
					diff,
				}

				return <TimerComponent key={timer.id} {...props} preview />
			})}
		</div>
	)
}
