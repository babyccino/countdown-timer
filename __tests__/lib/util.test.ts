import { capitalise, makeQueryString } from "@/lib/util"

describe("Utility functions", () => {
	it("make query string", () => {
		const query = { prop: "val" }
		const queryString = makeQueryString(query)
		expect(queryString).toEqual("prop=val")

		const query2 = { prop: "val", prop2: "val2" }
		const queryString2 = makeQueryString(query2)
		expect(queryString2).toEqual("prop=val&prop2=val2")
	})

	it("capitalise", () => {
		expect(capitalise("a")).toBe("A")
		expect(capitalise("abc")).toBe("Abc")
	})
})
