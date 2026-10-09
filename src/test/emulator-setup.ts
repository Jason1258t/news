// Setup for emulator tests (vitest.emulator.config.ts). These tests write and wipe data,
// so refuse to run unless the app's Firebase client points at the local emulators with a
// demo- project (never a real one).
const env = import.meta.env;
if (env.VITE_FIREBASE_EMULATORS !== "true" || !env.VITE_FIREBASE_PROJECT_ID?.startsWith("demo-")) {
    throw new Error(
        "Emulator tests must run with .env.emulator (npm run test:emulator); " +
            `got project "${env.VITE_FIREBASE_PROJECT_ID}".`,
    );
}
