import { act, render, screen } from "@testing-library/react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";
import { SessionProvider } from "./SessionProvider";
import { useSession } from "./useSession";

vi.mock("firebase/auth", () => ({ onAuthStateChanged: vi.fn() }));

const Probe = () => {
    const { user, visitorId, loading } = useSession();
    return <p>{loading ? "loading" : `${user?.email ?? "guest"} / ${visitorId ?? "none"}`}</p>;
};

describe("SessionProvider", () => {
    it("is loading until Firebase reports the auth state, then follows it", () => {
        let report!: (user: User | null) => void;
        const unsubscribe = vi.fn();
        vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
            report = callback as (user: User | null) => void;
            return unsubscribe;
        });
        const { unmount } = render(
            <SessionProvider>
                <Probe />
            </SessionProvider>,
        );
        expect(screen.getByText("loading")).toBeInTheDocument();

        act(() => report(null));
        expect(screen.getByText("guest / none")).toBeInTheDocument();
        act(() => report({ uid: "a1", email: "admin@news.test", isAnonymous: false } as User));
        expect(screen.getByText("admin@news.test / a1")).toBeInTheDocument();
        // Анонимный вход (лайки) — это всё ещё гость, но со своим uid.
        act(() => report({ uid: "anon", email: null, isAnonymous: true } as User));
        expect(screen.getByText("guest / anon")).toBeInTheDocument();

        unmount();
        expect(unsubscribe).toHaveBeenCalled();
    });

    it("useSession fails loudly outside the provider", () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<Probe />)).toThrow("useSession must be used within SessionProvider");
    });
});
