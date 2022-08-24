import type { NextApiRequest, NextApiResponse } from "next"

import { create as createTimer } from "../../models/timer"
import authenticate from "../../lib/auth"

export default async function _Timer(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	try {
		if (req.method.toLowerCase() != "post") {
			throw { status: 405, message: "/api/timer only takes post requests" }
		}

		const userId = authenticate(req, res)
		if (!userId) {
			throw { status: 401, message: "Unauthorised" }
		}

		console.log(req.body)
		const {
			title,
			endDate: endDateString,
			endTime: endTimeString,
		}: {
			title: string
			endDate: string
			endTime: string
			visibility: string
		} = req.body

		if (title.length < 1 || title.length > 100) {
			throw {
				status: 400,
				message: "Title length must be between 1 and 100 characters",
			}
		}
		if (!/^\w+$/.test(title)) {
			throw {
				status: 400,
				message: "Title only contain alphanumeric characters",
			}
		}

		// if time is specified, this time will be an ISO format string
		const endTime = new Date(endTimeString || endDateString)
		if (endTime.toUTCString() === "Invalid Date") {
			throw { status: 400, message: "Date not parsable" }
		}
		if (endTime.getTime() < new Date().getTime()) {
			throw { status: 400, message: "End date must be in future" }
		}

		const newTimer = await createTimer({
			title,
			userId,
			endTime,
		})

		console.log({ newTimer })
		res.status(200).json({ newTimer, redirect: `/timer/${newTimer.id}` })
	} catch (error) {
		console.error(error.message)
		return res.status(error.status ? error.status : 500).json(error.message)
	}
}
