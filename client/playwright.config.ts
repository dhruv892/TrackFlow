import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:5173",
  },
  webServer: {
    command: "npm run preview -- --host 0.0.0.0 --port 5173",
    port: 5173,
    timeout: 60_000,
    reuseExistingServer: true,
  },
  // Limit to Chromium in CI for speed; add Firefox/WebKit later if needed
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
