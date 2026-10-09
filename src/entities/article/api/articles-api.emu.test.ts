import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
    allBlocksArticle,
    seedArticles,
    seedEmulators,
    signInAsAdmin,
    signOutUser,
} from "test/emulator";
import { createArticle, deleteArticle, fetchArticleBySlug, fetchArticles } from "./articles-api";

// Real Firestore (emulator) with firestore.rules: npm run test:emulator.
const newArticle = (slug: string) => ({ ...allBlocksArticle, slug, title: `Новая ${slug}` });

const slugs = (page: { data: { slug: string }[] }) => page.data.map((article) => article.slug);

describe("articles API on the emulator", () => {
    beforeEach(async () => {
        await seedEmulators();
    });

    afterEach(async () => {
        await signOutUser();
    });

    it("pages through the feed newest first", async () => {
        const first = await fetchArticles({ limit: 5 });
        const second = await fetchArticles({ limit: 5, lastId: first.nextCursor });

        expect(slugs(first)).toEqual(seedArticles.slice(0, 5).map((a) => a.slug));
        expect(slugs(second)).toEqual(seedArticles.slice(5, 10).map((a) => a.slug));
        expect(second.hasMore).toBe(true);
    });

    it("filters by category", async () => {
        const page = await fetchArticles({ category: "Спорт", limit: 10 });

        expect(slugs(page)).toEqual(["football-final", "marathon", "chess-ai", "student-league"]);
    });

    it("filters by category and tags together (B15)", async () => {
        // Firestore allows a single array-contains filter: tags go to the query, category to the client.
        const page = await fetchArticles({ category: "Спорт", tags: ["футбол"], limit: 10 });

        expect(slugs(page)).toEqual(["football-final", "student-league"]);
    });

    it("reads an article with every block type as it was uploaded", async () => {
        const article = await fetchArticleBySlug("all-blocks");

        expect(article?.content).toEqual(allBlocksArticle.content);
    });

    it("returns null for a missing article", async () => {
        expect(await fetchArticleBySlug("missing")).toBeNull();
    });

    it("creates an article as admin, including table blocks", async () => {
        await signInAsAdmin();

        await createArticle(newArticle("fresh"));

        const saved = await fetchArticleBySlug("fresh");
        expect(saved?.title).toBe("Новая fresh");
        expect(saved?.content).toEqual(allBlocksArticle.content);
    });

    it("refuses to overwrite an existing slug", async () => {
        await signInAsAdmin();

        await expect(createArticle(newArticle("all-blocks"))).rejects.toThrow("уже существует");
        expect((await fetchArticleBySlug("all-blocks"))?.title).toBe(allBlocksArticle.title);
    });

    it("is rejected by the rules for a signed-out user", async () => {
        await expect(createArticle(newArticle("anon"))).rejects.toThrow(/permission/i);
    });

    it("deletes an article as admin", async () => {
        await signInAsAdmin();

        await deleteArticle("marathon");

        expect(await fetchArticleBySlug("marathon")).toBeNull();
        await expect(deleteArticle("marathon")).rejects.toThrow("не найдена");
    });
});
