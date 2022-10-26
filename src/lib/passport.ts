import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth2"
import jwt from "jsonwebtoken"

import { findByEmailOrCreate } from "@/models/user"
import { googleClientId, googleClientSecret, url, jwtSecret } from "./config"

passport.use(
	"google",
	new GoogleStrategy(
		{
			clientID: googleClientId,
			clientSecret: googleClientSecret,
			callbackURL: url + "/api/google/callback",
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
					jwtSecret
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
