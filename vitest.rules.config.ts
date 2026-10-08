import { defineConfig } from "vitest/config";

// Firestore security rules tests. They need the emulator, so they run separately:
// npm run test:rules (firebase emulators:exec starts and stops it).
export default defineConfig({
    test: {
        environment: "node",
        include: ["rules-tests/**/*.test.ts"],
        testTimeout: 15_000,
        hookTimeout: 30_000,
        fileParallelism: false,
    },
});
