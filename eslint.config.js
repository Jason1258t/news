import js from "@eslint/js";
import boundaries from "eslint-plugin-boundaries";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

// FSD layers, top to bottom. A layer may import only from layers below it.
const layers = ["app", "pages", "widgets", "features", "entities", "shared"];
const slicedLayers = ["pages", "widgets", "features", "entities"];

// Slices expose a public API via index.ts; reaching into their internals is not allowed.
const deepImportPatterns = [
    ...slicedLayers.map((layer) => `${layer}/*/*`),
    "shared/ui/*/*",
    "shared/lib/*/*",
    "shared/api/*",
    "shared/config/*",
];

const restrictImports = (extraGroups = []) => [
    "error",
    {
        patterns: [
            {
                group: deepImportPatterns,
                message: "Import from the slice public API (its index.ts) instead.",
            },
            {
                group: ["test/*"],
                message: "Test helpers are for tests only.",
            },
            ...extraGroups,
        ],
    },
];

export default tseslint.config(
    { ignores: ["dist", "coverage"] },
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
            ],
        },
    },
    {
        files: ["src/**/*.{js,jsx,ts,tsx}"],
        plugins: { boundaries },
        settings: {
            "boundaries/elements": layers.map((layer) => ({
                type: layer,
                pattern: `src/${layer}`,
            })),
            "import/resolver": { typescript: { project: "./tsconfig.app.json" } },
        },
        rules: {
            "boundaries/dependencies": [
                "error",
                {
                    default: "allow",
                    policies: layers.slice(1).map((layer, index) => ({
                        from: { element: { type: layer } },
                        disallow: {
                            to: { element: { types: { anyOf: layers.slice(0, index + 1) } } },
                        },
                    })),
                },
            ],
        },
    },
    {
        files: ["src/**/*.{js,jsx,ts,tsx}"],
        rules: { "no-restricted-imports": restrictImports() },
    },
    // Slices of the same layer must not depend on each other; inside a slice use relative imports.
    ...slicedLayers.map((layer) => ({
        files: [`src/${layer}/**/*.{js,jsx,ts,tsx}`],
        rules: {
            "no-restricted-imports": restrictImports([
                {
                    group: [`${layer}/*`],
                    message: `Slices of "${layer}" must not import each other. Use relative imports inside a slice.`,
                },
            ]),
        },
    })),
    // Tests mock slice internals (e.g. an API module), so they may import past the public API.
    {
        files: ["src/**/*.test.{ts,tsx}", "src/test/**"],
        rules: { "no-restricted-imports": "off" },
    },
    {
        files: ["*.config.{js,ts}", "emulator/**", "e2e/**", "rules-tests/**"],
        languageOptions: { globals: globals.node },
    },
    // Playwright fixtures must destructure their first argument, even when it is empty.
    {
        files: ["e2e/**"],
        rules: { "no-empty-pattern": "off" },
    },
);
