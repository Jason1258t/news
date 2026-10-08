import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "firebase/auth";
import { describe, expect, it } from "vitest";
import { SessionContext } from "entities/session";
import { renderWithProviders } from "../../../test/render";
import { Header } from "./Header";

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

    it("toggles the mobile menu and closes it after navigation", async () => {
        const user = userEvent.setup();
        renderHeader(null);
        const burger = screen.getByRole("button", { name: "Меню" });
        expect(burger).toHaveAttribute("aria-expanded", "false");

        await user.click(burger);
        expect(burger).toHaveAttribute("aria-expanded", "true");

        await user.click(screen.getByRole("link", { name: "Наука" }));
        expect(burger).toHaveAttribute("aria-expanded", "false");
    });

    it("links the logo to the home page", () => {
        renderHeader(null);
        expect(screen.getByRole("link", { name: /logo/ })).toHaveAttribute("href", "/");
    });
});
