import js from "@eslint/js";
import boundaries from "eslint-plugin-boundaries";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

// FSD layers, top to bottom. A layer may import only from layers below it.
const layers = ["app", "pages", "widgets", "features", "entities", "shared"];

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
            // Warn until the layer restructure (stage 3), then switch to "error".
            "boundaries/dependencies": [
                "warn",
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
        files: ["*.config.{js,ts}"],
        languageOptions: { globals: globals.node },
    },
);
