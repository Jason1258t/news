import { signInAnonymously } from "firebase/auth";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { auth } from "shared/api";
import { fetchDailyStats } from "entities/site-stats";
import { getStatsDay } from "shared/lib/date";
import { seedEmulators, signInAsAdmin, signOutUser } from "test/emulator";
import {
    fetchAllLikeCounts,
    fetchArticleLikes,
    fetchLikeCount,
    setArticleLiked,
} from "./likes-api";

// Real Firestore and Auth (emulators) with firestore.rules: npm run test:emulator.
describe("likes API on the emulator", () => {
    beforeEach(async () => {
        await seedEmulators();
    });

    afterEach(async () => {
        await signOutUser();
    });

    it("counts one like per anonymous reader", async () => {
        expect(await fetchArticleLikes("all-blocks", null)).toEqual({ count: 0, liked: false });

        const first = (await signInAnonymously(auth)).user.uid;
        await setArticleLiked("all-blocks", first, true);
        await expect(setArticleLiked("all-blocks", first, true)).rejects.toThrow(/permission/i);

        await signOutUser();
        const second = (await signInAnonymously(auth)).user.uid;
        await setArticleLiked("all-blocks", second, true);

        expect(await fetchArticleLikes("all-blocks", second)).toEqual({ count: 2, liked: true });
        expect(await fetchLikeCount("all-blocks")).toBe(2);

        await setArticleLiked("all-blocks", second, false);
        expect(await fetchArticleLikes("all-blocks", second)).toEqual({ count: 1, liked: false });
    });

    it("lists all-time likes for analytics, most liked first, without zeros", async () => {
        const uid = (await signInAnonymously(auth)).user.uid;
        await setArticleLiked("all-blocks", uid, true);
        await setArticleLiked("quantum-computer", uid, true);
        await setArticleLiked("quantum-computer", uid, false);
        await signOutUser();
        const other = (await signInAnonymously(auth)).user.uid;
        await setArticleLiked("all-blocks", other, true);
        await signOutUser();

        expect(await fetchAllLikeCounts()).toEqual([{ slug: "all-blocks", likes: 2 }]);
    });

    it("tracks the net likes in today's stats", async () => {
        const uid = (await signInAnonymously(auth)).user.uid;
        await setArticleLiked("all-blocks", uid, true);
        await setArticleLiked("quantum-computer", uid, true);
        await setArticleLiked("quantum-computer", uid, false);

        await signInAsAdmin();
        const today = getStatsDay();
        const [stats] = await fetchDailyStats(today, today);
        expect(stats?.likes).toBe(1);
    });
});
