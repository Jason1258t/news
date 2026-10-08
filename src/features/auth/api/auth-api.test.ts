import { signInWithEmailAndPassword, signOut, type UserCredential } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";
import { authApi } from "./auth-api";

vi.mock("firebase/auth", () => ({ signInWithEmailAndPassword: vi.fn(), signOut: vi.fn() }));

describe("authApi", () => {
    it("returns the user on success", async () => {
        const user = { email: "admin@news.test" };
        vi.mocked(signInWithEmailAndPassword).mockResolvedValue({ user } as UserCredential);

        expect(await authApi.loginWithEmail("admin@news.test", "pw")).toEqual({
            user,
            error: null,
        });
    });

    it("returns the error message instead of throwing", async () => {
        vi.mocked(signInWithEmailAndPassword).mockRejectedValue(
            new Error("auth/invalid-credential"),
        );
        vi.mocked(signOut).mockRejectedValue(new Error("network"));

        expect(await authApi.loginWithEmail("a", "b")).toEqual({
            user: null,
            error: "auth/invalid-credential",
        });
        expect(await authApi.logout()).toEqual({ error: "network" });
    });
});
