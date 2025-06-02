// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     fontFamily: {
//       inter: ["Inter", "sans-serif"],
//       "edu-sa": ["Edu SA Beginner", "cursive"],
//       mono: ["Roboto Mono", "monospace"],
//     },
//     colors: {

//       white: "#FFFFFF",
//       black: "#000000",
//       transparent: "transparent",

//       richblack: {
//         5: "#fff7ed",
//         25: "#ffedd5",
//         50: "#fed7aa",
//         100: "#fdba74",
//         200: "#fb923c",
//         300: "#f97316",
//         400: "#ea580c",
//         500: "#c2410c",
//         600: "#9a3412",
//         700: "#7c2d12",
//         800: "#652411",
//         900: "#4a1e0c",
//       },

//       richblue: {
//         5: "#fdf4ff",
//         25: "#fae8ff",
//         50: "#f5d0fe",
//         100: "#f0abfc",
//         200: "#e879f9",
//         300: "#d946ef",
//         400: "#c026d3",
//         500: "#a21caf",  // violet-magenta blend
//         600: "#86198f",
//         700: "#701a75",
//         800: "#581c63",
//         900: "#3b0a3d",
//       },

//       caribbeangreen: {
//         5: "#f0fdfa",
//         25: "#ccfbf1",
//         50: "#99f6e4",
//         100: "#5eead4",
//         200: "#2dd4bf",
//         300: "#14b8a6",
//         400: "#0d9488",
//         500: "#0f766e",  // teal accent
//         600: "#115e59",
//         700: "#134e4a",
//         800: "#0f3e3a",
//         900: "#0a2e2a",
//       },

//       brown: {
//         5: "#fef2f2",
//         25: "#fee2e2",
//         50: "#fecaca",
//         100: "#fca5a5",
//         200: "#f87171",
//         300: "#ef4444",
//         400: "#dc2626",
//         500: "#b91c1c", // sunset red
//         600: "#991b1b",
//         700: "#7f1d1d",
//         800: "#661111",
//         900: "#450a0a",
//       },

//       pink: {
//         5: "#fdf2f8",
//         25: "#fce7f3",
//         50: "#fbcfe8",
//         100: "#f9a8d4",
//         200: "#f472b6",
//         300: "#ec4899",
//         400: "#db2777",
//         500: "#be185d",
//         600: "#9d174d",
//         700: "#831843",
//         800: "#6b0f36",
//         900: "#500724",
//       },

//       yellow: {
//         5: "#fffbeb",
//         25: "#fef9c3",
//         50: "#fef08a",
//         100: "#fde047",
//         200: "#facc15", // sunny gold
//         300: "#eab308",
//         400: "#ca8a04",
//         500: "#a16207",
//         600: "#854d0e",
//         700: "#713f12",
//         800: "#5c3913",
//         900: "#422006",
//       },

//       "pure-greys": {
//         5: "#f9fafb",
//         25: "#f3f4f6",
//         50: "#e5e7eb",
//         100: "#d1d5db",
//         200: "#9ca3af",
//         300: "#6b7280",
//         400: "#4b5563",
//         500: "#374151",
//         600: "#1f2937",
//         700: "#111827",
//         800: "#0f172a",
//         900: "#0b1120",
//       },
//     },

//     extend: {
//       maxWidth: {
//         maxContent: "1260px",
//         maxContentTab: "650px",
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      "edu-sa": ["Edu SA Beginner", "cursive"],
      mono: ["Roboto Mono", "monospace"],
    },
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      transparent: "transparent",

      richblack: {
        5: "#E8F0ED",
        25: "#DDECE6",
        50: "#C4E3D8",
        100: "#A6D8C8",
        200: "#86CBB6",
        300: "#66BEA3",
        400: "#4DBD96",
        500: "#13aa52", // Leafy Green (MongoDB brand)
        600: "#108A43",
        700: "#FFFFFF", // White for contrast
        800: "#0B4F28",
        900: "#083B1E",
      },

      richblue: {
        5: "#EBF8FF",
        25: "#D1EEFC",
        50: "#A7DDF9",
        100: "#7ECBF6",
        200: "#55B9F3",
        300: "#2BA7F0",
        400: "#0498EC", // MongoDB accent blue
        500: "#0380C9",
        600: "#026AA5",
        700: "#015380",
        800: "#003D5C",
        900: "#002A3F",
      },

      caribbeangreen: {
        5: "#F0FFF4",
        25: "#C6F6D5",
        50: "#9AE6B4",
        100: "#68D391",
        200: "#48BB78",
        300: "#38A169",
        400: "#2F855A",
        500: "#276749", // MongoDB green UI elements
        600: "#22543D",
        700: "#1C4532",
        800: "#17372A",
        900: "#0F241C",
      },

      brown: {
        5: "#FFF5F5",
        25: "#FED7D7",
        50: "#FEB2B2",
        100: "#FC8181",
        200: "#F56565",
        300: "#E53E3E",
        400: "#C53030",
        500: "#EF4C4C", // MongoDB warning/red
        600: "#9B2C2C",
        700: "#822727",
        800: "#63171B",
        900: "#4A0D0D",
      },

      pink: {
        5: "#FFF0F6",
        25: "#FFD6E7",
        50: "#FFB8D2",
        100: "#FF94B4",
        200: "#FF6C97",
        300: "#F43F5E",
        400: "#DB2777",
        500: "#BE185D",
        600: "#9D174D",
        700: "#831843",
        800: "#6B0F36",
        900: "#500724",
      },

      yellow: {
        5: "#FFFBEB",
        25: "#FEF3C7",
        50: "#FDE68A",
        100: "#FCD34D",
        200: "#FBBF24",
        300: "#F59E0B",
        400: "#D97706",
        500: "#FFDD49", // MongoDB accent yellow
        600: "#B45309",
        700: "#92400E",
        800: "#78350F",
        900: "#633112",
      },

      "pure-greys": {
        5: "#F9FAFB",
        25: "#F3F4F6",
        50: "#E5E7EB",
        100: "#D1D5DB",
        200: "#9CA3AF",
        300: "#6B7280",
        400: "#4B5563",
        500: "#374151",
        600: "#1F2937",
        700: "#111827",
        800: "#0F172A",
        900: "#0B1120",
      },
    },

    extend: {
      maxWidth: {
        maxContent: "1260px",
        maxContentTab: "650px",
      },
    },
  },
  plugins: [],
};
