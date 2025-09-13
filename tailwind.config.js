// tailwind.config.js

module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Orbitron"', 'sans-serif'], // Futuristic font
      },
      colors: {
        neonPink: "#ff00cc",
        neonPurple: "#8a2be2",
        darkBg: "#0d0014",
        darkerBg: "#1a001f",
        chatBg: "#120016",
      },
      boxShadow: {
        neonPink: "0 0 10px #ff00cc80",
        neonPurple: "0 0 10px #8a2be280",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px #ff00cc" },
          "50%": { boxShadow: "0 0 20px #ff00cc" },
          "100%": { boxShadow: "0 0 5px #ff00cc" },
        },
        pulseNeon: {
          "0%, 100%": { textShadow: "0 0 6px #ff00cc" },
          "50%": { textShadow: "0 0 20px #ff00cc" },
        },
      },
      animation: {
        glow: "glow 2s ease-in-out infinite",
        pulseNeon: "pulseNeon 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
