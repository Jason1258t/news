import { defineConfig, devices } from "@playwright/test";

// End-to-end tests against the app on the local Firebase emulators (seeded with
// emulator/seed-data.ts). Run with npm run test:e2e, which starts the emulators.
const PORT = 5180;

export default defineConfig({
    testDir: "e2e",
    // Tests share one emulator database and reseed it, so they run one at a time.
    workers: 1,
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: "retain-on-failure",
        locale: "ru-RU",
        timezoneId: "UTC",
    },
    projects: [
        { name: "desktop", use: { ...devices["Desktop Chrome"] } },
        { name: "mobile", use: { ...devices["Pixel 7"] }, grep: /@mobile/ },
    ],
    webServer: {
        command: `vite --mode emulator --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
    },
});
