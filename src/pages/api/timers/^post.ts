import type { NextApiRequest, NextApiResponse } from "next"

import { create as createTimer, Visibility } from "@/models/timer"
import authenticate from "@/lib/auth"
import ServerError from "@/lib/error"

export default async function postTimer(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const userId = authenticate(req, res)
	if (!userId) {
		throw new ServerError("Unauthorised", 401)
	}

	console.log("Create post request received: ", { body: req.body })
	const {
		title,
		endDate: endDateString,
	}: {
		title: string
		endDate: string
		visibility: string
	} = req.body

	const _visibility = req.body.visibility.toUpperCase()
	if (
		!(
			_visibility === Visibility.HIDDEN ||
			_visibility === Visibility.PUBLIC ||
			_visibility === Visibility.PROTECTED
		)
	) {
		throw new ServerError('Visibility must be "public", "hidden" or "protected"', 400)
	}
	const visiblity: Visibility = _visibility as Visibility

	if (title.length < 1 || title.length > 100) {
		throw new ServerError("Title length must be between 1 and 100 characters", 400)
	}

	// if time is specified, this time will be an ISO format string
	const endTime = new Date(endDateString)
	if (endTime.toUTCString() === "Invalid Date") {
		throw new ServerError("Date not parsable", 400)
	}
	if (endTime.getTime() < new Date().getTime()) {
		throw new ServerError("End date must be in future", 400)
	}

	const newTimer = await createTimer({
		title,
		userId,
		endTime,
		visiblity,
		password: null,
	})

	console.log("New timer created: ", { newTimer })
	const path = `/timer/${newTimer.id}`
	await res.revalidate(path)
	res.status(200).json({ newTimer, redirect: path })
}
