import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrollToTopButton } from "./ScrollToTopButton";

const scrollPageTo = (y: number) => {
    Object.defineProperty(window, "scrollY", { value: y, configurable: true });
    fireEvent.scroll(window);
};

describe("ScrollToTopButton", () => {
    afterEach(() => {
        scrollPageTo(0);
    });

    it("appears only after scrolling down and scrolls back to the top", async () => {
        const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
        render(<ScrollToTopButton />);
        expect(screen.queryByRole("button", { name: "Наверх" })).not.toBeInTheDocument();

        scrollPageTo(301);
        await userEvent.click(screen.getByRole("button", { name: "Наверх" }));

        expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
        scrollPageTo(100);
        expect(screen.queryByRole("button", { name: "Наверх" })).not.toBeInTheDocument();
    });
});
