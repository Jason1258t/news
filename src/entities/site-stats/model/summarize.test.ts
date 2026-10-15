import { describe, expect, it } from "vitest";
import { summarizeStats } from "./summarize";

describe("summarizeStats", () => {
    const period = ["2026-10-13", "2026-10-14", "2026-10-15"];

    it("fills missing days with zeros and keeps the period order", () => {
        const summary = summarizeStats(period, [
            { day: "2026-10-15", visits: 4, articles: {} },
            { day: "2026-10-13", visits: 2, articles: {} },
        ]);

        expect(summary.days.map((d) => [d.day, d.visits])).toEqual([
            ["2026-10-13", 2],
            ["2026-10-14", 0],
            ["2026-10-15", 4],
        ]);
        expect(summary.totalVisits).toBe(6);
    });

    it("sums article views across days and sorts them, ties by slug", () => {
        const summary = summarizeStats(period, [
            { day: "2026-10-13", visits: 1, articles: { b: 1, a: 2 } },
            { day: "2026-10-15", visits: 1, articles: { b: 3, c: 2 } },
        ]);

        expect(summary.topArticles).toEqual([
            { slug: "b", views: 4 },
            { slug: "a", views: 2 },
            { slug: "c", views: 2 },
        ]);
        expect(summary.totalArticleViews).toBe(8);
    });

    it("ignores days outside the period", () => {
        const summary = summarizeStats(period, [
            { day: "2026-10-01", visits: 9, articles: { old: 9 } },
        ]);

        expect(summary.totalVisits).toBe(0);
        expect(summary.topArticles).toEqual([]);
    });
});
