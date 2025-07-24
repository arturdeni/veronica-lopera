// vite.config.js - ARCHIVO COMPLETO
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api-inmovilla": {
        target: "https://procesos.inmovilla.com/api/v1",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api-inmovilla/, ""),
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("🚫 Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("📤 Sending Request:", req.method, req.url);

            // Asegurar que el token se envía correctamente
            if (!proxyReq.getHeader("Token")) {
              console.warn("⚠️ Token missing in request!");
            }
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log("📥 Received Response:", proxyRes.statusCode, req.url);

            // Log de rate limiting
            if (proxyRes.statusCode === 408) {
              console.error("🚫 Rate limit exceeded (408) for:", req.url);
            }
          });
        },
      },
    },
  },
});
