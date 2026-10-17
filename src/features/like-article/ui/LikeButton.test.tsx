import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchArticleLikes, setArticleLiked } from "entities/article-like";
import { ensureVisitorId } from "entities/session";
import { renderWithProviders } from "test/render";
import { LikeButton } from "./LikeButton";

vi.mock("entities/article-like/api/likes-api", () => ({
    fetchArticleLikes: vi.fn(),
    setArticleLiked: vi.fn(),
}));
vi.mock("entities/session/api/ensure-visitor", () => ({ ensureVisitorId: vi.fn() }));
vi.mock("react-hot-toast", () => ({ default: { error: vi.fn() } }));

const fetchMock = vi.mocked(fetchArticleLikes);
const setMock = vi.mocked(setArticleLiked);
const visitorMock = vi.mocked(ensureVisitorId);

const deferred = () => {
    let resolve!: () => void;
    const promise = new Promise<void>((r) => (resolve = r));
    return { promise, resolve };
};

describe("LikeButton", () => {
    beforeEach(() => {
        fetchMock.mockReset();
        setMock.mockReset().mockResolvedValue(undefined);
        visitorMock.mockReset().mockResolvedValue("anon-1");
        vi.mocked(toast.error).mockReset();
    });

    it("signs the reader in anonymously and likes the article", async () => {
        fetchMock
            .mockResolvedValueOnce({ count: 4, liked: false })
            .mockResolvedValue({ count: 5, liked: true });
        const write = deferred();
        setMock.mockReturnValue(write.promise);
        renderWithProviders(<LikeButton slug="a" />);

        const button = await screen.findByRole("button", { name: "Нравится" });
        await waitFor(() => expect(button).toBeEnabled());
        expect(button).toHaveTextContent("4");
        expect(button).toHaveAttribute("aria-pressed", "false");

        await userEvent.click(button);
        // Сразу показывает лайк, пока запись идёт.
        expect(button).toHaveTextContent("5");
        expect(button).toHaveAttribute("aria-pressed", "true");
        expect(button).toBeDisabled();

        write.resolve();
        await waitFor(() => expect(button).toBeEnabled());
        expect(setMock).toHaveBeenCalledWith("a", "anon-1", true);
        expect(button).toHaveTextContent("5");
        expect(button).toHaveAccessibleName("Убрать лайк");
    });

    it("removes a like on the second press", async () => {
        fetchMock
            .mockResolvedValueOnce({ count: 1, liked: true })
            .mockResolvedValue({ count: 0, liked: false });
        renderWithProviders(<LikeButton slug="a" />);

        await userEvent.click(await screen.findByRole("button", { name: "Убрать лайк" }));

        const button = await screen.findByRole("button", { name: "Нравится" });
        expect(setMock).toHaveBeenCalledWith("a", "anon-1", false);
        await waitFor(() => expect(button).toBeEnabled());
        expect(button).toHaveTextContent("0");
    });

    it("rolls back and reports a failed write", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        fetchMock.mockResolvedValue({ count: 2, liked: false });
        setMock.mockRejectedValue(new Error("permission-denied"));
        renderWithProviders(<LikeButton slug="a" />);

        const button = await screen.findByRole("button", { name: "Нравится" });
        await waitFor(() => expect(button).toBeEnabled());
        await userEvent.click(button);

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Не удалось сохранить лайк"));
        await waitFor(() => expect(button).toBeEnabled());
        expect(button).toHaveTextContent("2");
        expect(button).toHaveAttribute("aria-pressed", "false");
    });
});
