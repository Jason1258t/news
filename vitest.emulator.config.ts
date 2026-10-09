import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

// Tests against the local Firebase emulators: security rules (rules-tests/) and API modules
// talking to real Firestore/Auth (src/**/*.emu.test.ts). They need the emulators, so they run
// separately: npm run test:emulator (firebase emulators:exec starts and stops them).
export default defineConfig({
    resolve: viteConfig.resolve,
    test: {
        environment: "node",
        include: ["rules-tests/**/*.test.ts", "src/**/*.emu.test.ts"],
        // Run with --mode emulator (see package.json) so .env.emulator is loaded; the setup file
        // aborts if the Firebase client would talk to a real project.
        setupFiles: ["./src/test/emulator-setup.ts"],
        testTimeout: 15_000,
        hookTimeout: 30_000,
        // All files share one emulator and reset it between tests.
        fileParallelism: false,
    },
});
