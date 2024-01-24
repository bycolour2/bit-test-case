/** @type {import('tailwindcss').Config} */
import { fontFamily as _fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "base-black": "#0E0C15",
        primary: "#1C64F2",
        "primart-light": "#4785FF",
        strong: "#073CA4",
        "strong-down": "#0E3176",
        gray1: "#616D8D",
        gray2: "#313E62",
        gray3: "#222B44",
        gray4: "#121825",
        gray5: "#374151",
        gray6: "#9CA3AF",
        critic: "#FE4242",
      },
      screens: {
        sm: "576px",
        md: "834px",
        lg: "1440px",
      },
      boxShadow: {
        button: "box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);",
      },
    },
    fontFamily: {
      sans: ["IBMPlexSans-Regular", ..._fontFamily.sans],
    },
  },
  plugins: [],
};
