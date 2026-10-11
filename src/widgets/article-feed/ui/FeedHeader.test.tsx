import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "test/render";
import { FeedHeader } from "./FeedHeader";

const LocationProbe = () => <output>{decodeURIComponent(useLocation().search)}</output>;

const renderHeader = (route: string) =>
    renderWithProviders(
        <>
            <FeedHeader />
            <LocationProbe />
        </>,
        { route },
    );

describe("FeedHeader", () => {
    it("marks the selected category", () => {
        renderHeader("/?category=Наука");

        expect(screen.getByRole("link", { name: "Наука" })).toHaveAttribute("aria-current", "page");
        expect(screen.getByRole("link", { name: "Все" })).not.toHaveAttribute("aria-current");
    });

    it("marks «Все» and shows no tag controls without filters", () => {
        renderHeader("/");

        expect(screen.getByRole("link", { name: "Все" })).toHaveAttribute("aria-current", "page");
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("keeps the tags when switching category and drops the category on «Все»", () => {
        renderHeader("/?category=Наука&tags=ии");

        expect(screen.getByRole("link", { name: "Спорт" })).toHaveAttribute(
            "href",
            "/?category=%D0%A1%D0%BF%D0%BE%D1%80%D1%82&tags=%D0%B8%D0%B8",
        );
        expect(screen.getByRole("link", { name: "Все" })).toHaveAttribute(
            "href",
            "/?tags=%D0%B8%D0%B8",
        );
    });

    it("removes a single tag and keeps the category", async () => {
        renderHeader("/?category=Наука&tags=ии,космос");

        await userEvent.click(screen.getByRole("button", { name: "Удалить тег ии" }));

        expect(screen.getByRole("status")).toHaveTextContent("?category=Наука&tags=космос");
    });

    it("clears all tags", async () => {
        renderHeader("/?tags=ии,космос");

        await userEvent.click(screen.getByRole("button", { name: "Очистить все" }));

        expect(screen.getByRole("status")).toHaveTextContent(/^$/);
        expect(screen.queryByText("ии")).not.toBeInTheDocument();
    });
});
