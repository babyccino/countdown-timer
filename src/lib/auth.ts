import type { NextApiRequest, NextApiResponse } from "next"

import { getCookie } from "cookies-next"
import jwt from "jsonwebtoken"

import { jwtSecret } from "./config"
import ServerError from "./error"

export default function authenticate(req: NextApiRequest, res: NextApiResponse): string {
	// check cookie
	const token = getCookie("token", { req, res })
	if (!token) {
		throw new ServerError("No token", 401)
	}

	const verified = jwt.verify(token.toString(), jwtSecret) as jwt.JwtPayload

	if (!verified || !verified.id) {
		throw new ServerError("Error decoding token", 500)
	}

	return verified.id
}
