import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";
import { SessionContext } from "entities/session";
import { renderWithProviders } from "../../../test/render";
import { Header } from "./Header";

vi.mock("shared/api/firebase", () => ({ auth: {} }));

const renderHeader = (user: User | null) =>
    renderWithProviders(
        <SessionContext.Provider value={{ user, loading: false }}>
            <Header />
        </SessionContext.Provider>,
    );

describe("Header", () => {
    it("links guests to the login page", () => {
        renderHeader(null);
        expect(screen.getByRole("link", { name: "Войти" })).toHaveAttribute("href", "/login");
        expect(screen.queryByRole("link", { name: "Админка" })).not.toBeInTheDocument();
    });

    it("links signed-in users to the admin panel", () => {
        renderHeader({ email: "a@b.c" } as User);
        expect(screen.getByRole("link", { name: "Админка" })).toHaveAttribute("href", "/admin");
    });

    it("links categories to the filtered feed", () => {
        renderHeader(null);
        expect(screen.getByRole("link", { name: "Наука" })).toHaveAttribute(
            "href",
            "/?category=Наука",
        );
    });

    it("toggles the mobile menu", async () => {
        const user = userEvent.setup();
        const { container } = renderHeader(null);
        const nav = container.querySelector("nav.nav");
        const burger = container.querySelector(".burger-menu");
        expect(nav).not.toHaveClass("active");

        await user.click(burger!);
        expect(nav).toHaveClass("active");

        await user.click(screen.getByRole("link", { name: "Наука" }));
        expect(nav).not.toHaveClass("active");
    });
});
