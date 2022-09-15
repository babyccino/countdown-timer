import Link from "next/link"
import { useState, useEffect, memo } from "react"

import { DateDifference, decrement } from "../lib/date"
import { capitalise } from "../lib/util"

const STYLING = {
	article: {
		preview:
			"font-['Montserrat'] flex flex-col justify-between text-center min-w-full px-2 py-4 mb-6 md:mb-0 border border-black rounded-3xl",
		full: "font-['Montserrat'] flex flex-col justify-center text-center min-w-full px-6 md:px-20 md:pb-2",
	},
	h1: {
		preview: "text-3xl overflow-hidden text-center text-ellipsis line-clamp-2",
		full: "text-4xl md:text-5xl",
	},
	finishedInnerContainer: {
		preview:
			"mt-4 md:px-2 text-4xl min-h-[5.5rem] md:text-7xl md:min-h-[17rem]",
		full: "mt-12 md:px-4 md:pt-12 text-6xl md:text-8xl",
	},
	notFinishedInnerContainer: {
		preview: "grid grid-cols-4 md:grid-cols-2 mt-4 md:px-2",
		full: "grid grid-cols-2 md:grid-cols-4 mt-4 md:px-8 md:pt-12",
	},
	innerInnerContainer: {
		preview: "py-2",
		full: "py-4",
	},
	diff: {
		preview: "text-5xl md:text-8xl",
		full: "text-8xl md:text-9xl",
	},
	h2: {
		preview: "text-base",
		full: "text-2xl",
	},
}

const dateDifferenceKeys: (keyof DateDifference)[] = [
	"days",
	"hours",
	"minutes",
	"seconds",
]

// returns the greatest non-zero part of the difference
function getGreatestDateDiff(diff: DateDifference): [string, number] {
	if (diff.days > 0) return ["days", diff.days]
	if (diff.hours > 0) return ["hours", diff.hours]
	if (diff.minutes > 0) return ["minutes", diff.minutes]
	return ["seconds", diff.seconds]
}

function formatCategoryString(category: string, value: number): string {
	// if value is plural remove "s" from the end of the category name
	return capitalise(
		value !== 1 ? category : category.substring(0, category.length - 1)
	)
}

const TimerInner = memo(function TimerInner_({
	dateDifference,
	preview,
}: {
	dateDifference: DateDifference
	preview: boolean
}): JSX.Element {
	const previewString = preview ? "preview" : "full"

	// if the dateDifference is positive then the timer has not finished
	if (dateDifference.sign) {
		return (
			<div className={STYLING.notFinishedInnerContainer[previewString]}>
				{dateDifferenceKeys.map((category, index) => (
					<div
						id="days"
						className={STYLING.innerInnerContainer[previewString]}
						key={index}
					>
						<div className={STYLING.diff[previewString]}>
							{dateDifference[category]}
						</div>
						<h2 className={STYLING.h2[previewString]}>
							{formatCategoryString(
								category,
								dateDifference[category] as number
							)}
						</h2>
					</div>
				))}
			</div>
		)
	}

	const [category, value] = getGreatestDateDiff(dateDifference)
	return (
		<div className={STYLING.finishedInnerContainer[previewString]}>
			{`Finished ${value} ${formatCategoryString(category, value)} ago`}
		</div>
	)
})

const Timer = memo(function Timer_({
	title,
	id,
	diff: _diff,
	preview = false,
}: {
	title: string
	id: string
	diff: DateDifference
	preview: boolean
}): JSX.Element {
	const [diff, setDiff] = useState(_diff)

	useEffect(() => {
		const interval = setInterval(() => {
			setDiff((prev) => decrement(prev))
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	const previewString = preview ? "preview" : "full"

	return (
		<article className={STYLING.article[previewString]}>
			<Link href={`/timer/${id}`}>
				<a
					className={
						preview ? "flex flex-col justify-center h-[4.7rem] mx-1" : ""
					}
				>
					<h1 className={STYLING.h1[previewString]}>{title}</h1>
				</a>
			</Link>
			<TimerInner dateDifference={diff} preview={preview} />
		</article>
	)
})

export default Timer
