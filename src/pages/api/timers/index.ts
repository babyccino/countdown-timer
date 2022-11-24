import type { NextApiRequest, NextApiResponse } from "next"

import postTimer from "./^post"
import getTimers from "./^get"
import ServerError from "@/lib/error"

export default async function timers(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	try {
		const method = req.method?.toLowerCase()
		if (method === undefined || method === "get") return getTimers(req, res)
		if (method === "post") return postTimer(req, res)

		throw new ServerError("/api/timers only takes get or post requests", 405)
	} catch (error) {
		const status = error instanceof ServerError ? error.status : 500
		return res.status(status).json(error)
	}
}
