import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api-inmovilla": {
        target: "https://procesos.apinmo.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-inmovilla/, "/api/v1"),
      },
    },
  },
});
