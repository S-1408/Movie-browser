import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
export default defineConfig({
  plugins: [react()],
  resolve: {
    // same "@/..." alias as tsconfig.json
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom", // fake browser DOM so components can render
    globals: true,        // describe / it / expect without importing
    setupFiles: ["./vitest.setup.ts"],
    exclude: [...configDefaults.exclude, "e2e/**"], // e2e/ is for Playwright, not Vitest
  },
});
