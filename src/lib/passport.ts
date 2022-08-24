import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth2"
import jwt from "jsonwebtoken"

import { findByEmailOrCreate } from "../models/user"

passport.use(
	"google",
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "http://127.0.0.1:3000/api/google/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const user = await findByEmailOrCreate({
					email: profile.email,
					displayName: profile.displayName,
				})

				const token = jwt.sign(
					{
						id: user.id,
						created: Date.now().toString(),
					},
					process.env.JWT_SECRET
				)

				done(null, { ...user, id: undefined }, {
					message: "Auth successful",
					token,
				} as any)
			} catch (err) {
				console.error(err)
				done(err, false, { message: "Internal server error" })
			}
		}
	)
)

export default passport
