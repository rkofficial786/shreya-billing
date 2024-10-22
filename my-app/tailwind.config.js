const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        secondary: {
          50: "#fdf0ff",
          100: "#f8dbff",
          200: "#f0b8ff",
          300: "#e894ff",
          400: "#dc6fff",
          500: "#d344ff", // Main secondary color (bright purple-pink)
          600: "#b035db",
          700: "#8d28b8",
          800: "#6a1c94",
          900: "#471271",
        },
        accent: {
          50: "#fff0fa",
          100: "#ffdbf5",
          200: "#ffb8ec",
          300: "#ff94e3",
          400: "#ff6fd6",
          500: "#ff44c8", // Main accent color (purple-pink)
          600: "#db35a7",
          700: "#b82886",
          800: "#941c65",
          900: "#711244",
        },
        neutral: {
          50: "#f5f5f7",
          100: "#e6e4e9",
          200: "#ccc9d3",
          300: "#b3afbd",
          400: "#9994a7",
          500: "#807991", // Main neutral color (purple-tinted gray)
          600: "#665f75",
          700: "#4d4759",
          800: "#332f3c",
          900: "#1a1720",
        },
      },
    },
    boxShadow: {
      "soft-sm": "0 2px 4px 0 rgba(0,0,0,0.05)",
      soft: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      "soft-md":
        "0 6px 10px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      "soft-lg":
        "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      "soft-xl":
        "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      "soft-2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
      "inner-soft": "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
      "primary-sm": "0 2px 4px 0 rgba(46,105,220,0.2)",
      primary:
        "0 4px 6px -1px rgba(46,105,220,0.3), 0 2px 4px -1px rgba(46,105,220,0.18)",
      "primary-md":
        "0 6px 10px -1px rgba(46,105,220,0.3), 0 2px 4px -1px rgba(46,105,220,0.18)",
      "primary-lg":
        "0 10px 15px -3px rgba(46,105,220,0.3), 0 4px 6px -2px rgba(46,105,220,0.15)",
      "primary-xl":
        "0 20px 25px -5px rgba(46,105,220,0.3), 0 10px 10px -5px rgba(46,105,220,0.12)",
      "primary-2xl": "0 25px 50px -12px rgba(46,105,220,0.4)",
      "inner-primary": "inset 0 2px 4px 0 rgba(46,105,220,0.18)",
      crisp:
        "0px 1px 2px 0px rgba(60, 64, 67, 0.3), 0px 1px 3px 1px rgba(60, 64, 67, 0.15)",
      subtle: "0px 2px 8px 0px rgba(0, 0, 0, 0.15)",
      "subtle-inset":
        "0px 1px 1px 0px rgba(9, 30, 66, 0.25), 0px 0px 1px 1px rgba(9, 30, 66, 0.13)",
      elegant: "0px 0px 16px 0px rgba(17, 17, 26, 0.1)",
    },
  },
  plugins: [],
});
