import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(58, 38, 24)",
          accent: "rgb(108, 79, 57)",
          light: "#f8f0e8",
          muted: "#b8956a",
        },
        "brand-brown": {
          DEFAULT: "rgb(58, 38, 24)",
          accent: "rgb(108, 79, 57)",
          light: "#f8f0e8",
          muted: "#b8956a",
        },
      },
    },
  },
};

export default config;
