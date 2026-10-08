import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Date formatting depends on the local time zone; pin it so tests behave the same everywhere.
process.env.TZ = "UTC";

const layers = ["app", "pages", "widgets", "features", "entities", "shared"];

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [...layers, "test"].map((dir) => ({
            find: new RegExp(`^${dir}/`),
            replacement: fileURLToPath(new URL(`./src/${dir}/`, import.meta.url)),
        })),
    },
    build: {
        outDir: "dist",
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        include: ["src/**/*.test.{ts,tsx}"],
        restoreMocks: true,
        coverage: {
            provider: "v8",
            include: ["src/**/*.{ts,tsx,js,jsx}"],
            exclude: ["src/**/*.test.*", "src/test/**", "src/main.tsx"],
        },
    },
});
