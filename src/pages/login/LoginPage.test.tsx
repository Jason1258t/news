import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "firebase/auth";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authApi } from "features/auth";
import { renderWithProviders } from "test/render";
import { LoginPage } from "./LoginPage";

vi.mock("features/auth/api/auth-api", () => ({
    authApi: { loginWithEmail: vi.fn(), logout: vi.fn() },
}));

const loginMock = vi.mocked(authApi.loginWithEmail);

const renderLogin = (state?: { from: string }) =>
    renderWithProviders(
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/create-article" element={<p>create article</p>} />
            <Route path="/admin/studio" element={<p>studio</p>} />
        </Routes>,
        { route: { pathname: "/login", state } },
    );

const submit = async () => {
    await userEvent.type(screen.getByLabelText("Email"), "admin@news.test");
    await userEvent.type(screen.getByLabelText("Пароль"), "secret");
    await userEvent.click(screen.getByRole("button", { name: "Войти" }));
};

describe("LoginPage", () => {
    beforeEach(() => {
        loginMock.mockReset();
    });

    it("signs in and opens the admin panel", async () => {
        loginMock.mockResolvedValue({ user: {} as User, error: null });
        renderLogin();

        await submit();

        expect(loginMock).toHaveBeenCalledWith("admin@news.test", "secret");
        expect(await screen.findByText("create article")).toBeInTheDocument();
    });

    it("returns to the page that required the login", async () => {
        loginMock.mockResolvedValue({ user: {} as User, error: null });
        renderLogin({ from: "/admin/studio" });

        await submit();

        expect(await screen.findByText("studio")).toBeInTheDocument();
    });

    it("shows an error and lets the user retry", async () => {
        loginMock.mockResolvedValue({ user: null, error: "auth/invalid-credential" });
        renderLogin();

        await submit();

        expect(await screen.findByRole("alert")).toHaveTextContent("Неверный email или пароль");
        expect(screen.getByRole("button", { name: "Войти" })).toBeEnabled();
    });
});
