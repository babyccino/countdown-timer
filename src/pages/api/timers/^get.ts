import type { NextApiRequest, NextApiResponse } from "next"
import { isValidDate } from "@/lib/date"

import ServerError from "@/lib/error"
import {
	getByEndTime,
	getByTimeCreated,
	getFromUserByEndTime,
	getFromUserByTimeCreated,
} from "@/models/timer"

export default async function getTimers(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	if (!req.query.sort || Array.isArray(req.query.sort))
		throw new ServerError("Sort must be included and not an array", 400)
	if (Array.isArray(req.query.offset))
		throw new ServerError("Offset must not be an array", 400)
	if (Array.isArray(req.query.userid))
		throw new ServerError("Offset must not be an array", 400)

	const { sort, userid } = req.query
	const offset = req.query.offset ? new Date(req.query.offset) : undefined
	if (offset && !isValidDate(offset))
		throw new ServerError("Offset date is invalid", 400)

	if (userid) {
		if (sort === "enddate") {
			const timers = await getFromUserByEndTime(userid, offset)
			return res.status(200).json({ timers })
		}

		if (sort === "created") {
			const timers = await getFromUserByTimeCreated(userid, offset)
			return res.status(200).json({ timers })
		}
	}

	if (sort === "enddate") {
		const timers = await getByEndTime(offset)
		return res.status(200).json({ timers })
	}

	if (sort === "created") {
		const timers = await getByTimeCreated(offset)
		return res.status(200).json({ timers })
	}
}
