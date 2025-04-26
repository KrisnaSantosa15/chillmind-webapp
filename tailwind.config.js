module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6b7fd7",
        "primary-light": "#8ca0ec",
        secondary: "#64c9b9",
        accent: "#f87171",
        background: "#f8f9fb",
        foreground: "#2a2f45",
        muted: "#eef2f7",
        "muted-foreground": "#64748b",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 6s ease-in-out infinite",
        orbit: "orbit 15s linear infinite",
        "orbit-reverse": "orbit 15s linear infinite reverse",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(50px) rotate(0deg)" },
          "100%": {
            transform: "rotate(360deg) translateX(50px) rotate(-360deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
