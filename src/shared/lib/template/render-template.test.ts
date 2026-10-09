import { describe, expect, it } from "vitest";
import { renderTemplate } from "./render-template";

describe("renderTemplate", () => {
    it("substitutes placeholders, tolerating inner spaces and repeats", () => {
        expect(renderTemplate("{{a}} + {{ b }} = {{a}}{{b}}", { a: "1", b: "2" })).toBe(
            "1 + 2 = 12",
        );
    });

    it("does not re-process substituted values", () => {
        expect(renderTemplate("{{a}}", { a: "{{b}}" })).toBe("{{b}}");
    });

    it("throws on a placeholder without a value", () => {
        expect(() => renderTemplate("Hi {{name}}", {})).toThrow('"{{name}}"');
    });

    it("leaves text without placeholders untouched", () => {
        expect(renderTemplate("{ not: a placeholder }", {})).toBe("{ not: a placeholder }");
    });
});
