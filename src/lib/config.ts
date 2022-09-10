const getEnvironmentVariable = (environmentVariable: string): string => {
	const unvalidatedEnvironmentVariable = process.env[environmentVariable]
	if (unvalidatedEnvironmentVariable === undefined) {
		throw new Error(
			`[Next.js] undefined environment variable: ${environmentVariable}`
		)
	} else {
		return unvalidatedEnvironmentVariable
	}
}

const googleClientId = getEnvironmentVariable("GOOGLE_CLIENT_ID")
const googleClientSecret = getEnvironmentVariable("GOOGLE_CLIENT_SECRET")
const url = getEnvironmentVariable("URL")
const jwtSecret = getEnvironmentVariable("JWT_SECRET")
const databaseUrl = getEnvironmentVariable("DATABASE_URL")

export { googleClientId, googleClientSecret, url, jwtSecret, databaseUrl }
