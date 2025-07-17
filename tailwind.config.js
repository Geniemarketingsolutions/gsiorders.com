/** @type {import('tailwindcss').Config} */
const moodTokens = require('./design_output/tokens/mood_tokens.json');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: [moodTokens.typography.fontFamily],
      },
      fontSize: {
        base: moodTokens.typography.fontSize,
      },
      colors: {
        background: moodTokens.colors.background,
        primary: moodTokens.colors.primary,
        secondary: moodTokens.colors.secondary,
      },
      borderRadius: {
        DEFAULT: moodTokens.borders.borderRadius,
      },
      boxShadow: {
        DEFAULT: moodTokens.borders.boxShadow,
      },
    },
  },
  plugins: [],
};
