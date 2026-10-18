import { renderHook } from "@testing-library/react";
import type { User } from "firebase/auth";
import type { ReactNode } from "react";
import { MemoryRouter, type InitialEntry } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { recordArticleView, recordVisit } from "entities/site-stats";
import { SessionContext, type SessionContextValue } from "entities/session";
import { useTrackArticleView, useTrackVisit } from "./useTrackViews";

vi.mock("entities/site-stats/api/stats-api", () => ({
    recordVisit: vi.fn(),
    recordArticleView: vi.fn(),
}));

const visitMock = vi.mocked(recordVisit);
const viewMock = vi.mocked(recordArticleView);

const guest: SessionContextValue = { user: null, visitorId: null, loading: false };

const withSession = (session: SessionContextValue, entries: InitialEntry[] = ["/"]) =>
    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <SessionContext.Provider value={session}>
                <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
                    {children}
                </MemoryRouter>
            </SessionContext.Provider>
        );
    };

describe("view tracking", () => {
    beforeEach(() => {
        vi.stubEnv("PROD", true);
        vi.stubEnv("VITE_FIREBASE_EMULATORS", "false");
        sessionStorage.clear();
        visitMock.mockReset().mockResolvedValue(undefined);
        viewMock.mockReset().mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("counts a visit once per tab session, with where it came from", () => {
        renderHook(() => useTrackVisit(), { wrapper: withSession(guest) });
        renderHook(() => useTrackVisit(), { wrapper: withSession(guest) });

        expect(visitMock.mock.calls).toEqual([["direct"]]);
    });

    it("takes the source of an article opened inside the site from the link", () => {
        renderHook(() => useTrackArticleView("a"), {
            wrapper: withSession(guest, [
                "/",
                { pathname: "/articles/a", state: { from: "feed" } },
            ]),
        });
        renderHook(() => useTrackArticleView("b"), {
            wrapper: withSession(guest, ["/about", "/articles/b"]),
        });

        expect(viewMock.mock.calls).toEqual([
            ["a", "feed"],
            ["b", "site"],
        ]);
    });

    it("counts each article once per session", () => {
        const { rerender } = renderHook(({ slug }) => useTrackArticleView(slug), {
            wrapper: withSession(guest),
            initialProps: { slug: undefined as string | undefined },
        });
        expect(viewMock).not.toHaveBeenCalled();

        rerender({ slug: "a" });
        rerender({ slug: "b" });
        rerender({ slug: "a" });

        expect(viewMock.mock.calls).toEqual([
            ["a", "direct"],
            ["b", "direct"],
        ]);
    });

    it("waits for the session and skips signed-in admins", () => {
        const admin = {
            user: { email: "admin@news.test" } as User,
            visitorId: "admin",
            loading: false,
        };
        renderHook(() => useTrackVisit(), {
            wrapper: withSession({ user: null, visitorId: null, loading: true }),
        });
        renderHook(() => useTrackVisit(), { wrapper: withSession(admin) });

        expect(visitMock).not.toHaveBeenCalled();
    });

    it.each([
        ["the dev server", { PROD: false }],
        ["the emulators", { VITE_FIREBASE_EMULATORS: "true" }],
    ])("does nothing on %s", (_, env) => {
        Object.entries(env).forEach(([key, value]) => vi.stubEnv(key, value));
        renderHook(() => useTrackVisit(), { wrapper: withSession(guest) });

        expect(visitMock).not.toHaveBeenCalled();
    });

    it("does not throw when the write fails", async () => {
        visitMock.mockRejectedValue(new Error("permission-denied"));

        expect(() =>
            renderHook(() => useTrackVisit(), { wrapper: withSession(guest) }),
        ).not.toThrow();
        await Promise.resolve();
    });

    it("still counts when sessionStorage is unavailable", () => {
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
            throw new Error("SecurityError");
        });
        renderHook(() => useTrackVisit(), { wrapper: withSession(guest) });

        expect(visitMock).toHaveBeenCalledTimes(1);
        vi.restoreAllMocks();
    });
});
