import { useState, useEffect, memo } from "react"
import Link from "next/link"

import {
	DateDifference,
	decrement,
	dateDifferenceKeys,
	formatCategoryString,
	getGreatestDateDiff,
} from "@/lib/date"

type StyleSheets = {
	[_ in "preview" | "full"]: {
		article: string
		title: string
		finishedInnerContainer: string
		notFinishedInnerContainer: string
		innerInnerContainer: string
		diff: string
		category: string
		user: string
	}
}
const STYLING: StyleSheets = {
	preview: {
		article:
			"font-['Montserrat'] flex flex-col justify-between text-center min-w-full px-2 py-4 mb-6 md:mb-0 border border-black rounded-3xl space-y-6",
		title: "text-3xl overflow-hidden text-center text-ellipsis line-clamp-2",
		finishedInnerContainer: "md:px-2 text-4xl md:text-7xl",
		notFinishedInnerContainer: "grid grid-cols-4 md:grid-cols-2 mt-4 md:px-2",
		innerInnerContainer: "py-2",
		diff: "text-5xl md:text-8xl",
		category: "text-base",
		user: "text-lg pt-2",
	},
	full: {
		article:
			"font-['Montserrat'] flex flex-col justify-center text-center min-w-full min-h-full px-6 md:px-20 md:pb-2 space-y-6",
		title: "text-4xl md:text-5xl",
		finishedInnerContainer: "md:px-4 md:pt-12 text-6xl md:text-8xl",
		notFinishedInnerContainer:
			"grid grid-cols-2 md:grid-cols-4 mt-4 md:px-8 md:pt-12",
		innerInnerContainer: "py-4",
		diff: "text-8xl md:text-9xl",
		category: "text-2xl",
		user: "py-12 text-xl",
	},
}

const MemoTimerInner = memo(TimerInner)
function Timer({
	title,
	id,
	diff: _diff,
	displayName,
	userId,
	preview = false,
}: {
	title: string
	id: string
	diff: DateDifference
	preview: boolean
	displayName: string
	userId: string
}): JSX.Element {
	if (!preview && (!displayName || !userId))
		throw new Error("User props must be defined if timer is not preview")

	const [diff, setDiff] = useState(_diff)

	useEffect(() => {
		const interval = setInterval(() => {
			setDiff((prev) => decrement(prev))
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	const styling = STYLING[preview ? "preview" : "full"]

	return (
		<article className={styling.article}>
			<Link
				href={`/timer/${id}`}
				className={
					preview ? "flex flex-col justify-center h-[4.7rem] mx-1" : undefined
				}
			>
				<h1 className={styling.title}>{title}</h1>
			</Link>
			<MemoTimerInner dateDifference={diff} preview={preview} />

			<Link href={`/user/${userId}`} className={styling.user}>
				Created by {displayName}
			</Link>
		</article>
	)
}

function TimerInner({
	dateDifference,
	preview,
}: {
	dateDifference: DateDifference
	preview: boolean
}): JSX.Element {
	const styling = STYLING[preview ? "preview" : "full"]

	// if the dateDifference is positive then the timer has not finished
	if (dateDifference.sign) {
		return (
			<ol className={styling.notFinishedInnerContainer}>
				{dateDifferenceKeys.map((category) => (
					<li key={category} className={styling.innerInnerContainer}>
						<div className={styling.diff}>{dateDifference[category]}</div>
						<div className={styling.category}>
							{formatCategoryString(
								category,
								dateDifference[category] as number
							)}
						</div>
					</li>
				))}
			</ol>
		)
	}

	const [category, value] = getGreatestDateDiff(dateDifference)
	const formattedCategory = formatCategoryString(category, value)
	return (
		<div className={styling.finishedInnerContainer}>
			{`Finished ${value} ${formattedCategory} ago`}
		</div>
	)
}

const MemoTimer = memo(Timer)
export { MemoTimer as Timer }
