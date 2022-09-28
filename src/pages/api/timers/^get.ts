import type { NextApiRequest, NextApiResponse } from "next"

import { getRecentPublic } from "../../../models/timer"

export default async function getTimers(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	console.log("Get timers request received: ", {
		offset: new Date(req.query.offset as string),
	})

	const timers = req.query.offset
		? await getRecentPublic(new Date(req.query.offset as string))
		: await getRecentPublic()
	res.status(200).json({ timers })
}
