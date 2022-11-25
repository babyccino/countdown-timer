import { makeQueryString } from "../../src/lib/api-util"
import { capitalise } from "../../src/lib/util"

describe("Utility functions", () => {
	it("make query string", () => {
		const queryString = makeQueryString({ sort: "created", userid: "hi" })
		expect(queryString).toEqual("sort=created&userid=hi")
	})

	it("capitalise", () => {
		expect(capitalise("a")).toBe("A")
		expect(capitalise("abc")).toBe("Abc")
	})
})
