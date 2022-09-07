import type { NextApiRequest, NextApiResponse } from "next"

import { findById } from "../../models/user"
import authenticate from "../../lib/auth"

export default async function User(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	try {
		const id = authenticate(req, res)
		const user = await findById(id)

		return res.json({ ...user, id: undefined })
	} catch (error) {
		return res.status(error.status || 500).json(error.message)
	}
}
