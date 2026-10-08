import { beforeEach, describe, expect, it, vi } from "vitest";
import { getArticlePreview } from "entities/article";
import { makeArticle } from "../../../test/fixtures";
import { useEditorsPickStore } from "./useEditorsPickStore";

vi.mock("shared/api/firebase", () => ({ db: {}, auth: {} }));

describe("useEditorsPickStore draft", () => {
    beforeEach(() => {
        useEditorsPickStore.setState({ editorsPicks: [], hasChanges: false });
    });

    it("adds a pick from an article preview, also for articles without og", () => {
        const article = makeArticle({ slug: "no-og", title: "Заголовок", og: {} });

        const pick = useEditorsPickStore.getState().addEditorsPick(getArticlePreview(article));

        expect(pick).toMatchObject({
            title: "Заголовок",
            description: article.description,
            badge: "Must Read",
            articleUrl: "https://vtech-news.ru/#/articles/no-og",
        });
        expect(useEditorsPickStore.getState()).toMatchObject({
            editorsPicks: [pick],
            hasChanges: true,
        });
    });

    it("changes a badge and removes a pick", () => {
        const { addEditorsPick } = useEditorsPickStore.getState();
        const pick = addEditorsPick(getArticlePreview(makeArticle()));

        useEditorsPickStore.getState().updateEditorsPickBadge(pick.id, "Deep Dive");
        expect(useEditorsPickStore.getState().editorsPicks[0]?.badge).toBe("Deep Dive");

        useEditorsPickStore.getState().removeEditorsPick(pick.id);
        expect(useEditorsPickStore.getState().editorsPicks).toEqual([]);
    });
});
