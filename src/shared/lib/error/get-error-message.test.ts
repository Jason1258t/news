import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./get-error-message";

describe("getErrorMessage", () => {
    it.each([
        [new Error("boom"), "boom"],
        ["plain", "plain"],
        [42, "42"],
        [undefined, "undefined"],
    ])("%j → %j", (value, expected) => {
        expect(getErrorMessage(value)).toBe(expected);
    });
});
