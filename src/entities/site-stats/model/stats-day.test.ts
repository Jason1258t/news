import { describe, expect, it } from "vitest";
import { getLastDays, getStatsDay } from "./stats-day";

describe("getStatsDay", () => {
    it("uses the Moscow date", () => {
        // 21:30 UTC is already the next day in Moscow
        expect(getStatsDay(new Date("2026-10-14T21:30:00Z"))).toBe("2026-10-15");
        expect(getStatsDay(new Date("2026-10-14T20:59:00Z"))).toBe("2026-10-14");
    });
});

describe("getLastDays", () => {
    it("lists the days up to today, oldest first", () => {
        expect(getLastDays(3, new Date("2026-03-01T10:00:00Z"))).toEqual([
            "2026-02-27",
            "2026-02-28",
            "2026-03-01",
        ]);
    });
});
