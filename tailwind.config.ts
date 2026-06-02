import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#0F8A5F",
          yellow: "#F7C948",
          blue: "#246BFD",
          ink: "#17202A",
          mist: "#F5F8F7"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 32, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
