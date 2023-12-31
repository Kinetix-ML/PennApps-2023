/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      boxShadow: {
        "glass": "0px 20px 80px 0px rgba(0, 0, 0, 0.2)",
        "glass-small": "0px 4px 40px 0px rgba(0, 0, 0, 0.2)",
        "glass-xs": "0px 4px 40px 0px rgba(0, 0, 0, 0.1)",
      },
      dropShadow: {
        "glass": "0px 4px 40px rgba(0, 0, 0, 0.5)"
      },
      spacing: {
        "card-h": "80vh",
        "card-w": "300px",
      },
      colors: {
        white: {
          0: "#FFFFFF",
          50: "#FBFBFB",
          100: "#EBEBEB",
          150: "#DDDDDD",
          200: "#D9D9D9",
        }
      },
      fontFamily: {
        logo: ["Elgoc Regular", "serif"],
        sans: ["DM Sans", "sans-serif"]
      }
    },
  },
  presets: [require('./node_modules/kinetixml-ui/dist/preset')],
  darkMode: 'class'
}

