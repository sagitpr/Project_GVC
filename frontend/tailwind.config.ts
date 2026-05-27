import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tesla: {
          blue: '#3E6AE1',      // Accent color
          white: '#FFFFFF',     // Pure white canvas
          ash: '#F4F4F4',       // Subtle background ash
          dark: '#171A20',      // Carbon Dark primary headings/text
          graphite: '#393C41',  // Body text graphite
          pewter: '#5C5E62',    // Subheadings and tertiary text
          silver: '#8E8E8E',    // Input placeholders
          cloud: '#EEEEEE',     // Border lines
        },
      },
      fontFamily: {
        sans: ['Universal Sans Text', '-apple-system', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        tesla: '4px',           // Characteristic sharp 4px corners
      },
      transitionTimingFunction: {
        tesla: 'cubic-bezier(0.33, 1, 0.68, 1)',
      },
      transitionDuration: {
        tesla: '330ms',         // Tesla universal transition speed
      },
    },
  },
  plugins: [],
};
export default config;
