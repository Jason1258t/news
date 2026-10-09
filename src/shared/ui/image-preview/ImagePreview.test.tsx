import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ImagePreview } from "./ImagePreview";

describe("ImagePreview", () => {
    it("renders nothing without a URL", () => {
        const { container } = render(<ImagePreview src={null} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("shows loading, then the image", () => {
        render(<ImagePreview src="https://img.example/a.png" />);
        expect(screen.getByRole("status")).toHaveTextContent("Загрузка изображения");

        fireEvent.load(screen.getByRole("img"));

        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("shows an error for a broken image and starts over for a new URL", () => {
        const { rerender } = render(<ImagePreview src="https://img.example/broken.png" />);
        fireEvent.error(screen.getByRole("img", { hidden: true }));
        expect(screen.getByRole("alert")).toHaveTextContent("Не удалось загрузить изображение");

        rerender(<ImagePreview src="https://img.example/fixed.png" />);

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("removes the image from the header and from the error state", async () => {
        const onRemove = vi.fn();
        render(<ImagePreview src="https://img.example/broken.png" onRemove={onRemove} />);

        await userEvent.click(screen.getByRole("button", { name: "Удалить изображение" }));
        fireEvent.error(screen.getByRole("img", { hidden: true }));
        await userEvent.click(screen.getByRole("button", { name: "Удалить" }));

        expect(onRemove).toHaveBeenCalledTimes(2);
    });
});
