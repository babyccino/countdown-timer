import type { NextApiRequest, NextApiResponse } from "next"

import passport from "../../../lib/passport"

export default function Index(req: NextApiRequest, res: NextApiResponse) {
	passport.authenticate("google", {
		state: req.query.redirect as string,
		scope: ["profile", "email"],
		session: false,
	})(req, res)
}
