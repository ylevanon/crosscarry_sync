/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./library/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#DC1E1E',
        neutral: {
          900: '#000000', // Main background
          800: '#1F1F1F', // Input backgrounds
          700: '#2D2D2D', // Borders
          600: '#3D3D3D',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
          50: '#F9FAFB',
        },
      },
    },
    fontFamily: {
      // System font for body text
      sans: ['System', 'sans-serif'],
      // LemonMilk variants for headers and special text
      "lemon-milk": ["LemonMilkRegular"],
      "lemon-milk-italic": ["LemonMilkRegularItalic"],
      "lemon-milk-light": ["LemonMilkLight"],
      "lemon-milk-light-italic": ["LemonMilkLightItalic"],
      "lemon-milk-medium": ["LemonMilkMedium"],
      "lemon-milk-medium-italic": ["LemonMilkMediumItalic"],
      "lemon-milk-bold": ["LemonMilkBold"],
      "lemon-milk-bold-italic": ["LemonMilkBoldItalic"],
    },
  },
  plugins: [],
};
