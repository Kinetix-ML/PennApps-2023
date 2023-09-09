/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  presets: [require('./node_modules/kinetixml-ui/dist/preset')],
  darkMode: 'class'
}

