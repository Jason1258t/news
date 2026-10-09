import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { clickableProps } from "./clickable-props";

describe("clickableProps", () => {
    it("makes a div a focusable button that reacts to click, Enter and Space", async () => {
        const onClick = vi.fn();
        render(
            <div {...clickableProps(onClick)}>
                <h3>Карточка</h3>
            </div>,
        );
        const card = screen.getByRole("button", { name: "Карточка" });

        await userEvent.tab();
        expect(card).toHaveFocus();
        await userEvent.keyboard("{Enter}");
        await userEvent.keyboard(" ");
        await userEvent.click(card);

        expect(onClick).toHaveBeenCalledTimes(3);
    });

    it("ignores keys pressed on nested controls", async () => {
        const onClick = vi.fn();
        render(
            <div {...clickableProps(onClick)}>
                <input aria-label="Поле" />
            </div>,
        );

        await userEvent.type(screen.getByLabelText("Поле"), "a b{Enter}");

        expect(onClick).toHaveBeenCalledTimes(1); // the click that focused the input
    });
});
