import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ babel: { babelrc: true } }), svgr()],
  resolve: {
    alias: { "~": path.resolve(__dirname, "./src") },
  },
  server: {
    open: true,
    port: 5300,
  },
});
