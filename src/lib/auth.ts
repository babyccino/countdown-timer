import type { NextApiRequest, NextApiResponse } from "next"

import { getCookie } from "cookies-next"
import jwt from "jsonwebtoken"

export default function authenticate(
	req: NextApiRequest,
	res: NextApiResponse
): string {
	// check cookie
	const token = getCookie("token", { req, res })
	if (!token) {
		throw { message: "No token", status: 401 }
	}

	const verified = jwt.verify(
		token.toString(),
		process.env.JWT_SECRET
	) as jwt.JwtPayload

	if (!verified || !verified.id) {
		throw { message: "Error decoding token", status: 500 }
	}

	return verified.id
}
