

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [require("daisyui")],
}

