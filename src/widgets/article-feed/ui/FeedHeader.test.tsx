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
    it("shows the selected category", () => {
        renderHeader("/?category=Наука");

        expect(screen.getByRole("heading", { name: "Наука" })).toBeInTheDocument();
    });

    it("renders nothing extra without filters", () => {
        renderHeader("/");

        expect(screen.queryByRole("heading")).not.toBeInTheDocument();
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
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
