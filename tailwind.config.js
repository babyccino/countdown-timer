/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{jsx,tsx}",
		"./src/pages/*.{jsx,tsx}",
		"./src/components/**/*.{jsx,tsx}",
		"./src/components/*.{jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	plugins: [
		require("@tailwindcss/line-clamp"),
		// ...
	],
}
