import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
}
export default config; 