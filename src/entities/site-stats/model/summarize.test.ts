import { describe, expect, it } from "vitest";
import { summarizeStats } from "./summarize";

describe("summarizeStats", () => {
    const period = ["2026-10-13", "2026-10-14", "2026-10-15"];

    it("fills missing days with zeros and keeps the period order", () => {
        const summary = summarizeStats(period, [
            {
                day: "2026-10-15",
                visits: 4,
                entries: {},
                articles: {},
                articleSources: {},
                likes: 3,
            },
            {
                day: "2026-10-13",
                visits: 2,
                entries: {},
                articles: {},
                articleSources: {},
                likes: 1,
            },
        ]);

        expect(summary.days.map((d) => [d.day, d.visits])).toEqual([
            ["2026-10-13", 2],
            ["2026-10-14", 0],
            ["2026-10-15", 4],
        ]);
        expect(summary.totalVisits).toBe(6);
        expect(summary.days.map((d) => d.likes)).toEqual([1, 0, 3]);
        expect(summary.totalNewLikes).toBe(4);
    });

    it("sums article views across days and sorts them, ties by slug", () => {
        const summary = summarizeStats(period, [
            {
                day: "2026-10-13",
                visits: 1,
                entries: {},
                articles: { b: 1, a: 2 },
                articleSources: {},
                likes: 0,
            },
            {
                day: "2026-10-15",
                visits: 1,
                entries: {},
                articles: { b: 3, c: 2 },
                articleSources: {},
                likes: 0,
            },
        ]);

        expect(summary.topArticles).toEqual([
            { slug: "b", views: 4, telegram: 0 },
            { slug: "a", views: 2, telegram: 0 },
            { slug: "c", views: 2, telegram: 0 },
        ]);
        expect(summary.totalArticleViews).toBe(8);
    });

    it("ignores days outside the period", () => {
        const summary = summarizeStats(period, [
            {
                day: "2026-10-01",
                visits: 9,
                entries: {},
                articles: { old: 9 },
                articleSources: {},
                likes: 0,
            },
        ]);

        expect(summary.totalVisits).toBe(0);
        expect(summary.topArticles).toEqual([]);
    });

    it("breaks down entries and article views by source, the rest is unknown", () => {
        const summary = summarizeStats(period, [
            {
                day: "2026-10-14",
                visits: 10,
                entries: { direct: 5, telegram: 3 },
                articles: { a: 6, b: 2 },
                articleSources: { a: { telegram: 3, feed: 1 }, b: { feed: 2 } },
                likes: 0,
            },
            {
                day: "2026-10-15",
                visits: 2,
                entries: { telegram: 2 },
                articles: { a: 1 },
                articleSources: { a: { telegram: 1 } },
                likes: 0,
            },
        ]);

        expect(summary.entrySources).toEqual([
            { source: "direct", count: 5 },
            { source: "telegram", count: 5 },
            { source: null, count: 2 },
        ]);
        expect(summary.articleSources).toEqual([
            { source: "telegram", count: 4 },
            { source: "feed", count: 3 },
            { source: null, count: 2 },
        ]);
        expect(summary.topArticles).toEqual([
            { slug: "a", views: 7, telegram: 4 },
            { slug: "b", views: 2, telegram: 0 },
        ]);
    });
});
