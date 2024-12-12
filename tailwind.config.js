/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./library/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC1E1E',
          light: '#E64646',
          dark: '#B01818',
        },
        neutral: {
          black: '#000000',
          white: '#FFFFFF',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
        },
      },
      fontFamily: {
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
  },
  plugins: [],
};
