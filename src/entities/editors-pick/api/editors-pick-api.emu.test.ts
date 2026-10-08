import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { seedEmulators, signInAsAdmin, signOutUser } from "test/emulator";
import type { EditorsPickInput } from "../model/types";
import { fetchEditorsPicks, replaceEditorsPicks } from "./editors-pick-api";

// Real Firestore (emulator) with firestore.rules: npm run test:emulator.
const pick = (title: string, badge: EditorsPickInput["badge"] = "Trending"): EditorsPickInput => ({
    title,
    badge,
    articleUrl: `/articles/${title}`,
});

const titles = async () => (await fetchEditorsPicks()).map((p) => p.title);

describe("editors' pick API on the emulator", () => {
    beforeEach(async () => {
        await seedEmulators();
    });

    afterEach(async () => {
        await signOutUser();
    });

    it("reads the seeded picks in order", async () => {
        expect(await titles()).toEqual(["Статья со всеми блоками", "Квантовый компьютер"]);
    });

    it("replaces the whole list and keeps the editor's order", async () => {
        await signInAsAdmin();
        const many = Array.from({ length: 12 }, (_, i) => pick(`p${i}`));

        await replaceEditorsPicks(many);

        // Position is encoded in the document ID; 12 items check that "p10" does not sort before "p2".
        expect(await titles()).toEqual(many.map((p) => p.title));
    });

    it("trims fields when saving", async () => {
        await signInAsAdmin();

        await replaceEditorsPicks([{ ...pick("  x  "), description: "  d  " }]);

        expect(await fetchEditorsPicks()).toEqual([
            expect.objectContaining({ title: "x", description: "d", badge: "Trending" }),
        ]);
    });

    it("leaves the list untouched when validation fails", async () => {
        await signInAsAdmin();

        await expect(replaceEditorsPicks([pick("ok"), pick(" ")])).rejects.toThrow("Запись 2");

        expect(await titles()).toEqual(["Статья со всеми блоками", "Квантовый компьютер"]);
    });

    it("is rejected by the rules for a signed-out user and changes nothing (B7)", async () => {
        await expect(replaceEditorsPicks([pick("anon")])).rejects.toThrow(/permission/i);

        expect(await titles()).toEqual(["Статья со всеми блоками", "Квантовый компьютер"]);
    });
});
