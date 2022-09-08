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
			callbackURL: process.env.URL + "/api/google/callback",
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
			} catch (error) {
				console.error(error)
				done(error, false, { message: "Internal server error" })
			}
		}
	)
)

export default passport
