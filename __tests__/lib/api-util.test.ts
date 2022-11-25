import { deSerialiseTimer, makeQueryString, serialiseTimer } from "../../src/lib/api-util"

import type { Timer } from "../../src/models/timer"
import type { SerialisedTimer } from "../../src/lib/api-util"

describe("Utility functions", () => {
	it("make query string", () => {
		const queryString = makeQueryString({ sort: "created", userid: "hi" })
		expect(queryString).toEqual("sort=created&userid=hi")
	})

	it("serialising then deserialising a timer gives original timer", () => {
		const time = "2022-01-01T00:00:00.000Z"
		const date = new Date(time)
		const timer: Timer = {
			createdAt: date,
			endTime: date,
			id: "1",
			title: "timer",
			user: {
				displayName: "me",
				id: "1",
			},
		}
		const expectSerialisedTimer: SerialisedTimer = {
			createdAt: time,
			endTime: time,
			id: "1",
			title: "timer",
			user: {
				displayName: "me",
				id: "1",
			},
		}

		const serialisedTimer = serialiseTimer(timer)
		expect(serialisedTimer).toEqual(expectSerialisedTimer)

		const newTimer = deSerialiseTimer(serialisedTimer)
		expect(newTimer).toEqual(timer)
	})
})
