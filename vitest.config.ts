import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Aponta para os configs locais de cada serviço que tem testes
    projects: [
      "apps/frontend/vitest.config.ts",
      "apps/register/vitest.config.ts",
      "apps/auth/vitest.config.ts",
      "apps/historico/vitest.config.ts",
    ],
  },
});