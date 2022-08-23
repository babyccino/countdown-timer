export interface DateDifference {
	seconds: number;
	minutes: number;
	hours: number;
	days: number;
}

export function dateDifference(date1: Date, date2: Date): DateDifference {
	const secondDiff = Math.floor((date1.getTime() - date2.getTime()) / 1000);
	const seconds = secondDiff % 60;

	const minuteDiff = (secondDiff - seconds) / 60;
	const minutes = minuteDiff % 60;

	const hourDiff = (minuteDiff - minutes) / 60;
	const hours = hourDiff % 24;

	const days = (hourDiff - hours) / 24;

	return { seconds, minutes, hours, days };
}
