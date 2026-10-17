import { signInAnonymously } from "firebase/auth";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { auth } from "shared/api";
import { seedEmulators, signOutUser } from "test/emulator";
import { fetchArticleLikes, fetchLikeCount, setArticleLiked } from "./likes-api";

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
});
