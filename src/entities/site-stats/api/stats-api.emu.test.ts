import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { seedEmulators, signInAsAdmin, signOutUser } from "test/emulator";
import { getStatsDay } from "../model/stats-day";
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
        await recordVisit();
        await recordVisit();
        await recordArticleView("quantum-computer");
        await recordArticleView("all-blocks");

        await signInAsAdmin();
        const [stats] = await fetchDailyStats(today, today);

        expect(stats).toEqual({
            day: today,
            visits: 2,
            articles: { "quantum-computer": 1, "all-blocks": 1 },
        });
    });

    it("does not count views of articles that do not exist", async () => {
        await expect(recordArticleView("no-such-article")).rejects.toThrow(/permission/i);
    });

    it("does not let a reader see the stats", async () => {
        await recordVisit();

        await expect(fetchDailyStats(today, today)).rejects.toThrow(
            "Не удалось загрузить статистику",
        );
    });
});
