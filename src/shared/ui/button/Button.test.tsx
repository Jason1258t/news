import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
    it("does not submit forms unless asked to", async () => {
        const onSubmit = vi.fn((event: Event) => event.preventDefault());
        render(
            <form onSubmit={onSubmit}>
                <Button>Plain</Button>
                <Button type="submit">Send</Button>
            </form>,
        );

        await userEvent.click(screen.getByRole("button", { name: "Plain" }));
        expect(onSubmit).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole("button", { name: "Send" }));
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("applies the variant and passes native props through", async () => {
        const onClick = vi.fn();
        render(
            <Button variant="danger" disabled onClick={onClick} aria-label="Удалить">
                x
            </Button>,
        );
        const button = screen.getByRole("button", { name: "Удалить" });

        expect(button.className).toMatch(/danger/);
        expect(button).toBeDisabled();
        await userEvent.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });
});
