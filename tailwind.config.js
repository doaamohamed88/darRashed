/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./node_modules/flowbite/**/*.js",".html"],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
      },
    },

    extend: {
      colors: {
        primary: {
          DEFAULT: "#A98A5B", 
          80: "rgba(169,138,91,0.8)",
          50: "rgba(169,138,91,0.5)",
          20: "rgba(169,138,91,0.2)",
        },

        dark: {
          DEFAULT: "#231F20", // Black
          80: "rgba(35,31,32,0.8)",
          50: "rgba(35,31,32,0.5)",
          20: "rgba(35,31,32,0.2)",
        },

        surface: "#FFFFFF",
      },

fontFamily: {
  arabic: ['"GE SS"', "sans-serif"],
  latin: ['"Gill Sans"', "sans-serif"],
},
      boxShadow: {
        card: "0 8px 20px rgba(35,31,32,0.08)",
      },

      borderRadius: {
        xl: "1rem",
      },
    },
  },

  plugins: [require("flowbite/plugin")],
};
