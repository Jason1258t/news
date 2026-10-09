import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ScrollToTop } from "./ScrollToTop";

describe("ScrollToTop", () => {
    it("scrolls up on a new page or category, not on a tag change", async () => {
        const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
        const { getByText } = render(
            <MemoryRouter>
                <ScrollToTop />
                <Link to="/?tags=a">tag</Link>
                <Link to="/?tags=a&category=Наука">category</Link>
                <Link to="/about">about</Link>
            </MemoryRouter>,
        );
        expect(scrollTo).toHaveBeenCalledTimes(1);

        await userEvent.click(getByText("tag"));
        expect(scrollTo).toHaveBeenCalledTimes(1);
        await userEvent.click(getByText("category"));
        expect(scrollTo).toHaveBeenCalledTimes(2);
        await userEvent.click(getByText("about"));
        expect(scrollTo).toHaveBeenCalledTimes(3);
    });
});
