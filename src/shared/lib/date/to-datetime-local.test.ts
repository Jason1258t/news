import { describe, expect, it } from "vitest";
import { toDateTimeLocal } from "./to-datetime-local";

describe("toDateTimeLocal", () => {
    it("formats local time with zero padding and no seconds", () => {
        expect(toDateTimeLocal(new Date(2026, 0, 2, 3, 4, 59))).toBe("2026-01-02T03:04");
    });

    it("keeps two-digit parts as is", () => {
        expect(toDateTimeLocal(new Date(2026, 11, 31, 23, 45))).toBe("2026-12-31T23:45");
    });
});
