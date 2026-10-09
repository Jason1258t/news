import { renderHook, act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { useDeleteConfirmation } from "./useDeleteConfirmation";

const Harness = ({ onConfirm }: { onConfirm: () => Promise<void> }) => {
    const confirmation = useDeleteConfirmation();
    return (
        <>
            <button
                type="button"
                onClick={() => confirmation.openModal({ title: "Удалить статью?", onConfirm })}
            >
                Открыть
            </button>
            <DeleteConfirmationModal {...confirmation.modalProps} />
        </>
    );
};

describe("DeleteConfirmationModal + useDeleteConfirmation", () => {
    it("runs the action and closes", async () => {
        const onConfirm = vi.fn().mockResolvedValue(undefined);
        render(<Harness onConfirm={onConfirm} />);

        await userEvent.click(screen.getByRole("button", { name: "Открыть" }));
        const dialog = screen.getByRole("dialog", { name: "Удалить статью?" });
        await userEvent.click(screen.getByRole("button", { name: "Удалить" }));

        expect(onConfirm).toHaveBeenCalledOnce();
        expect(dialog).not.toBeInTheDocument();
    });

    it("cancels without running the action, also with Escape", async () => {
        const onConfirm = vi.fn();
        render(<Harness onConfirm={onConfirm} />);

        await userEvent.click(screen.getByRole("button", { name: "Открыть" }));
        await userEvent.click(screen.getByRole("button", { name: "Отмена" }));
        await userEvent.click(screen.getByRole("button", { name: "Открыть" }));
        await userEvent.keyboard("{Escape}");

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("locks the dialog while the action runs", async () => {
        let finish!: () => void;
        const onConfirm = () => new Promise<void>((resolve) => (finish = resolve));
        render(<Harness onConfirm={onConfirm} />);

        await userEvent.click(screen.getByRole("button", { name: "Открыть" }));
        await userEvent.click(screen.getByRole("button", { name: "Удалить" }));

        expect(screen.getByText("Удаление...")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Отмена" })).toBeDisabled();
        await userEvent.keyboard("{Escape}");
        expect(screen.getByRole("dialog")).toBeInTheDocument();

        await act(async () => finish());
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("keeps the dialog open when the action throws", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        const { result } = renderHook(() => useDeleteConfirmation());

        act(() => result.current.openModal({ onConfirm: () => Promise.reject(new Error("x")) }));
        await act(() => result.current.handleConfirm());

        expect(result.current.isOpen).toBe(true);
        expect(result.current.isLoading).toBe(false);
    });
});
