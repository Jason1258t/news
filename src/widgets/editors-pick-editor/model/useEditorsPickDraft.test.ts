import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { EditorsPick } from "entities/editors-pick";
import { useEditorsPickDraft } from "./useEditorsPickDraft";

const saved: EditorsPick[] = [
    {
        id: "pick_1",
        title: "Saved",
        description: "",
        badge: "Trending",
        articleUrl: "https://site/#/articles/saved",
        createdAt: new Date(0),
        updatedAt: new Date(0),
    },
];

const preview = { title: "New", description: "Desc", url: "https://site/#/articles/new" };

describe("useEditorsPickDraft", () => {
    it("shows the saved picks until something changes", () => {
        const { result } = renderHook(() => useEditorsPickDraft(saved));
        expect(result.current.picks).toBe(saved);
        expect(result.current.hasChanges).toBe(false);
    });

    it("adds a pick from an article preview", () => {
        const { result } = renderHook(() => useEditorsPickDraft(saved));
        act(() => result.current.add(preview));

        expect(result.current.hasChanges).toBe(true);
        expect(result.current.picks.map((pick) => pick.title)).toEqual(["Saved", "New"]);
        expect(result.current.picks[1]).toMatchObject({
            badge: "Must Read",
            articleUrl: preview.url,
            description: "Desc",
        });
    });

    it("applies several edits in a row", () => {
        const { result } = renderHook(() => useEditorsPickDraft(saved));
        act(() => {
            result.current.add(preview);
            result.current.changeBadge("pick_1", "Deep Dive");
            result.current.remove(result.current.picks[0]!.id);
        });

        expect(result.current.picks.map((pick) => [pick.title, pick.badge])).toEqual([
            ["New", "Must Read"],
        ]);
    });

    it("reset returns to the saved picks", () => {
        const { result } = renderHook(() => useEditorsPickDraft(saved));
        act(() => result.current.remove("pick_1"));
        act(() => result.current.reset());

        expect(result.current.picks).toBe(saved);
        expect(result.current.hasChanges).toBe(false);
    });

    it("works before the saved picks have loaded", () => {
        const { result } = renderHook(() => useEditorsPickDraft(undefined));
        expect(result.current.picks).toEqual([]);
        act(() => result.current.add(preview));
        expect(result.current.picks).toHaveLength(1);
    });
});
