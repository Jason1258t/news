import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { seedEmulators, signInAsAdmin, signOutUser } from "test/emulator";
import { getStatsDay } from "shared/lib/date";
import { fetchDailyStats, recordArticleView, recordVisit } from "./stats-api";

// Real Firestore (emulator) with firestore.rules: npm run test:emulator.
describe("stats API on the emulator", () => {
    const today = getStatsDay();

    beforeEach(async () => {
        await seedEmulators();
    });

    afterEach(async () => {
        await signOutUser();
    });

    it("lets a reader count visits and article views that the admin then reads", async () => {
        await recordVisit("telegram");
        await recordVisit("direct");
        await recordArticleView("quantum-computer", "telegram");
        await recordArticleView("all-blocks", "feed");

        await signInAsAdmin();
        const [stats] = await fetchDailyStats(today, today);

        expect(stats).toEqual({
            day: today,
            visits: 2,
            entries: { telegram: 1, direct: 1 },
            articles: { "quantum-computer": 1, "all-blocks": 1 },
            articleSources: { "quantum-computer": { telegram: 1 }, "all-blocks": { feed: 1 } },
            likes: 0,
        });
    });

    it("does not count views of articles that do not exist", async () => {
        await expect(recordArticleView("no-such-article", "direct")).rejects.toThrow(/permission/i);
    });

    it("does not let a reader see the stats", async () => {
        await recordVisit("direct");

        await expect(fetchDailyStats(today, today)).rejects.toThrow(
            "Не удалось загрузить статистику",
        );
    });
});
