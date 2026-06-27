import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  // App vive sob /fonoaudiologia/ no domínio do CIn.
  // Sem isso, os assets (JS/CSS) seriam pedidos na raiz e dariam 404.
  base: "/fonoaudiologia/",
  appType: "spa",
  server: {
    host: "0.0.0.0",          // aceita conexões de fora do container
    port: 8080,
    allowedHosts: ["frontend"], // nome do serviço no compose
    hmr: { overlay: false },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
});