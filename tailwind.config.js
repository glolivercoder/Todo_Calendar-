/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary))',
        secondary: 'rgb(var(--color-secondary))',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px rgb(var(--color-primary) / 0.5)' },
          '100%': { textShadow: '0 0 20px rgb(var(--color-primary))' },
        },
      },
    },
  },
  plugins: [
    import('@tailwindcss/forms'),
    import('daisyui'),
  ],
} 