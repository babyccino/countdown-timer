import { capitalise } from "./util"

export interface DateDifference {
	seconds: number
	minutes: number
	hours: number
	days: number
	sign: boolean
}

export function decrement(date: DateDifference): DateDifference {
	if (isZero(date))
		return {
			seconds: 1,
			minutes: 0,
			hours: 0,
			days: 0,
			sign: false,
		}

	let newDateDiff = Object.assign({}, date)

	if (newDateDiff.sign) {
		newDateDiff.seconds -= 1
		if (newDateDiff.seconds >= 0) return newDateDiff
		newDateDiff.minutes += Math.floor(newDateDiff.seconds / 60)
		newDateDiff.seconds += 60

		if (newDateDiff.minutes >= 0) return newDateDiff
		newDateDiff.hours += Math.floor(newDateDiff.minutes / 60)
		newDateDiff.minutes += 60

		if (newDateDiff.hours >= 0) return newDateDiff
		newDateDiff.days += Math.floor(newDateDiff.hours / 24)
		newDateDiff.hours += 24
	} else {
		newDateDiff.seconds += 1
		if (newDateDiff.seconds < 60) return newDateDiff
		newDateDiff.minutes += Math.floor(newDateDiff.seconds / 60)
		newDateDiff.seconds = newDateDiff.seconds % 60

		if (newDateDiff.minutes < 60) return newDateDiff
		newDateDiff.hours += Math.floor(newDateDiff.minutes / 60)
		newDateDiff.minutes = newDateDiff.minutes % 60

		if (newDateDiff.hours < 24) return newDateDiff
		newDateDiff.days += Math.floor(newDateDiff.hours / 24)
		newDateDiff.hours = newDateDiff.hours % 24
	}

	return newDateDiff
}

export function isZero({
	seconds,
	minutes,
	hours,
	days,
}: DateDifference): boolean {
	return seconds === 0 && minutes === 0 && hours === 0 && days === 0
}

export const zeroDateDiff = (): DateDifference => ({
	seconds: 0,
	minutes: 0,
	hours: 0,
	days: 0,
	sign: true,
})

export function dateDifference(
	date1: Date,
	date2: Date = new Date()
): DateDifference {
	const signedMsDiff = date1.getTime() - date2.getTime()
	const sign = signedMsDiff >= 0
	const unsignedMsDiff = signedMsDiff * (sign ? 1 : -1)

	const seconds = Math.floor(unsignedMsDiff / 1000) % 60
	const minutes = Math.floor(unsignedMsDiff / (1000 * 60)) % 60
	const hours = Math.floor(unsignedMsDiff / (1000 * 60 * 60)) % 24
	const days = Math.floor(unsignedMsDiff / (1000 * 60 * 60 * 24))

	return { seconds, minutes, hours, days, sign }
}

export const dateDifferenceKeys: (keyof DateDifference)[] = [
	"days",
	"hours",
	"minutes",
	"seconds",
]

// returns the greatest non-zero part of the difference
export function getGreatestDateDiff(
	diff: DateDifference
): [keyof DateDifference, number] {
	if (diff.days > 0) return ["days", diff.days]
	if (diff.hours > 0) return ["hours", diff.hours]
	if (diff.minutes > 0) return ["minutes", diff.minutes]
	return ["seconds", diff.seconds]
}

export function formatCategoryString(
	category: keyof DateDifference,
	value: number
): string {
	// if value is plural remove "s" from the end of the category name
	return capitalise(
		value !== 1 ? category : category.substring(0, category.length - 1)
	)
}

// the required format for the HTML date input element is YYYY-MM-DDThh-mm which is just the first 16 characters of the iso date
const ISO_SLICE_INDEX = 16
export function htmlMinDateFormat(dateTime: Date): string {
	return dateTime.toISOString().slice(0, ISO_SLICE_INDEX)
}

export function getCurrentDateInHtmlFormat(): string {
	return htmlMinDateFormat(new Date())
}

export function isValidDate(date: Date): boolean {
	return !isNaN(date.getTime())
}
