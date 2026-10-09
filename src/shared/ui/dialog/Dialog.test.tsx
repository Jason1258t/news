import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";

const renderDialog = (onClose = vi.fn()) => {
    render(
        <Dialog labelledBy="title" onClose={onClose}>
            <h2 id="title">Заголовок</h2>
            <button type="button">Действие</button>
        </Dialog>,
    );
    return onClose;
};

describe("Dialog", () => {
    it("is a modal dialog named by its title", () => {
        renderDialog();

        const dialog = screen.getByRole("dialog", { name: "Заголовок" });
        expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("takes focus when it opens", () => {
        renderDialog();

        expect(screen.getByRole("dialog")).toHaveFocus();
    });

    it("closes on Escape", async () => {
        const onClose = renderDialog();

        await userEvent.keyboard("{Escape}");

        expect(onClose).toHaveBeenCalledOnce();
    });
});
