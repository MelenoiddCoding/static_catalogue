/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        'brand-yellow': 'var(--brand-yellow)',
        'brand-yellow-2': 'var(--brand-yellow-2)',
        'brand-dark': 'var(--brand-dark)',
        'brand-black': 'var(--brand-black)',
      },
      fontFamily: {
        heading: ['Oswald', 'Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
