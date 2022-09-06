import type { DateDifference } from "../../src/lib/date"
import { dateDifference, decrement } from "../../src/lib/date"

describe("Date difference", () => {
	it("Difference between two dates is correct", () => {
		const diff1 = dateDifference(
			new Date("2022-01-02T12:01:01"),
			new Date("2022-01-01T11:00:00")
		)
		expect(diff1).toEqual({
			sign: true,
			days: 1,
			hours: 1,
			minutes: 1,
			seconds: 1,
		})

		const diff2 = dateDifference(
			new Date("2022-01-01T11:00:00"),
			new Date("2022-01-02T12:01:01")
		)
		expect(diff2).toEqual({
			sign: false,
			days: 1,
			hours: 1,
			minutes: 1,
			seconds: 1,
		})
	})

	it("Decrementing a date difference gives corrent result", () => {
		const diff1: DateDifference = {
			days: 1,
			hours: 0,
			minutes: 0,
			seconds: 0,
			sign: true,
		}
		expect(decrement(diff1)).toEqual({
			days: 0,
			hours: 23,
			minutes: 59,
			seconds: 59,
			sign: true,
		})

		const diff2: DateDifference = {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			sign: true,
		}
		expect(decrement(diff2)).toEqual({
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 1,
			sign: false,
		})

		const diff3: DateDifference = {
			days: 0,
			hours: 23,
			minutes: 59,
			seconds: 59,
			sign: false,
		}
		expect(decrement(diff3)).toEqual({
			days: 1,
			hours: 0,
			minutes: 0,
			seconds: 0,
			sign: false,
		})
	})
})
