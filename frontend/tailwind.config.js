/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"header-t-white": "#ffffff11",
			},
			fontFamily: {
				Merriweather: ["Merriweather", "serif"],
			},
		},
	},
	plugins: [],
};
