import type { NextApiRequest, NextApiResponse } from "next"

import { findById } from "@/models/user"
import authenticate from "@/lib/auth"
import ServerError from "@/lib/error"

export default async function User(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	try {
		if (req.method?.toLowerCase() !== "get") {
			throw new ServerError("/api/user only takes get requests", 405)
		}

		const id = authenticate(req, res)
		const user = await findById(id)

		return res.json({ ...user })
	} catch (error) {
		const status = error instanceof ServerError ? error.status : 500
		return res.status(status).json(error)
	}
}
