const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#b6a0ff",
        surface: "#0e0e10",
        "on-surface": "#fffbfe",
        "outline-variant": "#48474a",
        "highlight-cyan": "#00f5ff",
        "highlight-blue": "#5865f2",
        exam: {
          teal: "#002f36",
          "teal-mid": "#014751",
          cream: "#fff9e5",
          yellow: "#efe58f",
          "yellow-bright": "#f5df4d",
          lavender: "#e4dcf5",
          mint: "#6fcf97",
          grey: "#f2f4f4",
          ink: "#1a1d1e",
          muted: "#5c6366",
        },
      },
      fontFamily: {
        headline: ["Newsreader", "Georgia", "serif"],
        body: ["Manrope", "system-ui", "sans-serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "blob-slow": "blobSlow 20s infinite alternate",
        "blob-reverse": "blobReverse 25s infinite alternate",
        "exam-float": "examFloat 6s ease-in-out infinite",
      },
      keyframes: {
        blobSlow: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        blobReverse: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(-50px, 40px) scale(1.2)" },
          "66%": { transform: "translate(40px, -20px) scale(0.8)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        examFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
});
