import type { NextApiRequest, NextApiResponse } from "next"

import {
	getRecentPublic,
	create as createTimer,
	Visibility,
} from "../../models/timer"
import authenticate from "../../lib/auth"

async function postTimer(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
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

	const _visibility = req.body.visibility.toUpperCase()
	if (
		!(
			_visibility === Visibility.HIDDEN ||
			_visibility === Visibility.PUBLIC ||
			_visibility === Visibility.PROTECTED
		)
	) {
		throw {
			status: 400,
			message: 'Visibility must be "public", "hidden" or "protected"',
		}
	}
	const visiblity: Visibility = _visibility as Visibility

	if (title.length < 1 || title.length > 100) {
		throw {
			status: 400,
			message: "Title length must be between 1 and 100 characters",
		}
	}
	if (!/^[\w\s]+$/.test(title)) {
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
		visiblity,
	})

	console.log({ newTimer })
	const path = `/timer/${newTimer.id}`
	await res.revalidate(path)
	res.status(200).json({ newTimer, redirect: path })
}

async function getTimers(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	console.log({ offset: new Date(req.query.offset as string) })

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
		const method = req.method.toLowerCase()
		if (method === "post") return postTimer(req, res)
		if (method === "get") return getTimers(req, res)

		throw {
			status: 405,
			message: "/api/timers only takes get or post requests",
		}
	} catch (error) {
		console.error(error)
		return res.status(error.status || 500).json(error.message)
	}
}
