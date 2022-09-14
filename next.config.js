const path = require("path")

module.exports = {
	reactStrictMode: true,
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},
}
