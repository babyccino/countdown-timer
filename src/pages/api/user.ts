import type { NextApiRequest, NextApiResponse } from "next"

import { findById } from "../../models/user"
import authenticate from "../../lib/auth"

export default async function _User(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	try {
		const id = authenticate(req, res)
		const user = await findById(id)

		return res.json({ ...user, id: undefined })
	} catch (err) {
		return res.status(500).json(err)
	}
}
