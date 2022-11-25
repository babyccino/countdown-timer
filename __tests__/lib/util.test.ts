import { capitalise } from "../../src/lib/util"

describe("Utility functions", () => {
	it("capitalise", () => {
		expect(capitalise("a")).toBe("A")
		expect(capitalise("abc")).toBe("Abc")
	})
})
