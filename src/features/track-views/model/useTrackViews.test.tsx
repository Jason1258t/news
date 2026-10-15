import { renderHook } from "@testing-library/react";
import type { User } from "firebase/auth";
import type { ReactNode } from "react";
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

const guest: SessionContextValue = { user: null, loading: false };

const withSession = (session: SessionContextValue) =>
    function Wrapper({ children }: { children: ReactNode }) {
        return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
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

    it("counts a visit once per tab session", () => {
        renderHook(() => useTrackVisit(), { wrapper: withSession(guest) });
        renderHook(() => useTrackVisit(), { wrapper: withSession(guest) });

        expect(visitMock).toHaveBeenCalledTimes(1);
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

        expect(viewMock.mock.calls).toEqual([["a"], ["b"]]);
    });

    it("waits for the session and skips signed-in admins", () => {
        const admin = { user: { email: "admin@news.test" } as User, loading: false };
        renderHook(() => useTrackVisit(), {
            wrapper: withSession({ user: null, loading: true }),
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
