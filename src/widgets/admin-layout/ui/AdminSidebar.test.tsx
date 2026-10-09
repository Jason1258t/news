import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "firebase/auth";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { authApi } from "features/auth";
import { SessionContext } from "entities/session";
import { renderWithProviders } from "test/render";
import { AdminSidebar } from "./AdminSidebar";

vi.mock("features/auth/api/auth-api", () => ({
    authApi: { loginWithEmail: vi.fn(), logout: vi.fn().mockResolvedValue({ error: null }) },
}));

const renderSidebar = () =>
    renderWithProviders(
        <SessionContext.Provider
            value={{ user: { email: "admin@news.test" } as User, loading: false }}
        >
            <Routes>
                <Route path="/admin/studio" element={<AdminSidebar />} />
                <Route path="/login" element={<p>login page</p>} />
                <Route path="/" element={<p>home page</p>} />
            </Routes>
        </SessionContext.Provider>,
        { route: "/admin/studio" },
    );

describe("AdminSidebar", () => {
    it("shows the user and highlights the current section", () => {
        renderSidebar();

        expect(screen.getByText("admin@news.test")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Студия" })).toHaveAttribute(
            "aria-current",
            "page",
        );
    });

    it("logs out and goes to the login page", async () => {
        renderSidebar();

        await userEvent.click(screen.getByRole("button", { name: "Выйти" }));

        expect(authApi.logout).toHaveBeenCalled();
        expect(await screen.findByText("login page")).toBeInTheDocument();
    });

    it("goes back to the site", async () => {
        renderSidebar();

        await userEvent.click(screen.getByRole("button", { name: "На главную" }));

        expect(screen.getByText("home page")).toBeInTheDocument();
    });
});
