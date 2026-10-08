/**
 * Only guards the design system: component CSS must use tokens from
 * src/app/styles/tokens.css instead of raw colors.
 * @type {import("stylelint").Config}
 */
export default {
    rules: {
        "color-no-hex": [true, { message: "Use a color token from app/styles/tokens.css" }],
        "color-named": ["never", { message: "Use a color token from app/styles/tokens.css" }],
    },
    overrides: [
        {
            files: ["src/app/styles/tokens.css"],
            rules: { "color-no-hex": null, "color-named": null },
        },
    ],
};
