import type { NextApiRequest, NextApiResponse } from "next"

import {
	getRecentPublic,
	create as createTimer,
	Visibility,
} from "../../models/timer"
import authenticate from "../../lib/auth"
import ServerError from "../../lib/error"

async function postTimer(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
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
		throw new ServerError(
			'Visibility must be "public", "hidden" or "protected"',
			400
		)
	}
	const visiblity: Visibility = _visibility as Visibility

	if (title.length < 1 || title.length > 100) {
		throw new ServerError(
			"Title length must be between 1 and 100 characters",
			400
		)
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
	})

	console.log("New timer created: ", { newTimer })
	const path = `/timer/${newTimer.id}`
	await res.revalidate(path)
	res.status(200).json({ newTimer, redirect: path })
}

async function getTimers(
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

export default async function Timer(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
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
