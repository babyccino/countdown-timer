import type { NextApiRequest, NextApiResponse } from "next";

import { setCookie } from "cookies-next";

import passport from "../../../lib/passport";

export default function Callback(req: NextApiRequest, res: NextApiResponse) {
	passport.authenticate("google", (err, user, info) => {
		if (err || !user) {
			return res.status(404).redirect("/?a=auth_fail");
		}

		// set cookie and send redirect
		setCookie("user", JSON.stringify(user), { req, res, maxAge: 60 * 60 * 8 });
		setCookie("token", info.token, { req, res, maxAge: 60 * 60 * 8 });

		// the original URL is passed to the api route in a query then passed to the google oauth via state
		// this state is then passed back to the callback route as a query
		res.status(200).redirect((req.query.state as string) || "/");
	})(req, res);
}