/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      boxShadow: {
        "glass": "0px 20px 80px 0px rgba(0, 0, 0, 0.2)",
      },
      spacing: {
        "card-h": "80vh",
        "card-w": "300px",
      },
      colors: {
        white: {
          50: "#FBFBFB",
          100: "#EBEBEB",
          200: "D9D9D9",
        }
      }
    },
  },
  presets: [require('./node_modules/kinetixml-ui/dist/preset')],
  darkMode: 'class'
}

