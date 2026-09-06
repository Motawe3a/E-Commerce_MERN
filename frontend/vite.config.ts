import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Dev serves from "/". Production builds default to the GitHub Pages project
  // path (https://<user>.github.io/E-Commerce_MERN/); override with VITE_BASE
  // (e.g. "/" for a custom domain or Netlify).
  base:
    process.env.VITE_BASE ??
    (command === "build" ? "/E-Commerce_MERN/" : "/"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
}));
