/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./library/**/*.{js,jsx,ts,tsx}"],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
