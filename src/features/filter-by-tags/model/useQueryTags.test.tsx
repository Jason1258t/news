import { act, renderHook } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { createWrapper } from "../../../test/render";
import { useQueryTags } from "./useQueryTags";

const setup = (route: string) =>
    renderHook(() => ({ tags: useQueryTags(), search: useLocation().search }), {
        wrapper: createWrapper({ route }),
    });

describe("useQueryTags", () => {
    it("reads tags from the query string, skipping blanks", () => {
        const { result } = setup("/?tags=a,,b, ");
        expect(result.current.tags.selectedTags).toEqual(["a", "b"]);
    });

    it("returns an empty list without the param", () => {
        const { result } = setup("/?category=x");
        expect(result.current.tags.selectedTags).toEqual([]);
    });

    it("adds a normalized tag and keeps other params", () => {
        const { result } = setup("/?category=x&tags=a");
        act(() => result.current.tags.addTag("  BigTag "));
        expect(result.current.tags.selectedTags).toEqual(["a", "bigtag"]);
        expect(new URLSearchParams(result.current.search).get("category")).toBe("x");
    });

    it("does not add duplicates or empty tags", () => {
        const { result } = setup("/?tags=a");
        act(() => result.current.tags.addTag("A"));
        act(() => result.current.tags.addTag("   "));
        expect(result.current.tags.selectedTags).toEqual(["a"]);
    });

    it("removes a tag", () => {
        const { result } = setup("/?tags=a,b");
        act(() => result.current.tags.removeTag("a"));
        expect(result.current.tags.selectedTags).toEqual(["b"]);
    });

    it("drops the param when clearing", () => {
        const { result } = setup("/?tags=a,b&category=x");
        act(() => result.current.tags.clearAllTags());
        expect(result.current.tags.selectedTags).toEqual([]);
        expect(result.current.search).toBe("?category=x");
    });
});
