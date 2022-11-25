import type { NextApiRequest, NextApiResponse } from "next"
import { isValidDate } from "@/lib/date"

import ServerError from "@/lib/error"
import { getPublicTimers, getPublicTimersFromUser } from "@/models/timer"
import { checkValidSort } from "@/lib/api-util"

export default async function getTimers(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	if (!req.query.sort || Array.isArray(req.query.sort))
		throw new ServerError("Sort must be included and not an array", 400)
	if (Array.isArray(req.query.offset)) throw new ServerError("Offset must not be an array", 400)
	if (Array.isArray(req.query.userid)) throw new ServerError("Userid must not be an array", 400)

	const { sort, userid } = req.query
	const offset = req.query.offset ? new Date(req.query.offset) : undefined
	if (offset && !isValidDate(offset)) throw new ServerError("Offset date is invalid", 400)

	checkValidSort(sort)
	const timers = await (userid
		? getPublicTimersFromUser(sort, userid, offset)
		: getPublicTimers(sort, offset))
	return res.status(200).json({ timers })
}
