import { screen } from "@testing-library/react";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "test/render";
import { fetchLikeCount } from "../api/likes-api";
import { LikeCount } from "./LikeCount";

vi.mock("../api/likes-api", () => ({ fetchLikeCount: vi.fn() }));

const fetchMock = vi.mocked(fetchLikeCount);

describe("LikeCount", () => {
    beforeEach(() => {
        fetchMock.mockReset();
    });

    it("loads the count only once the card is on screen", async () => {
        fetchMock.mockResolvedValue(7);
        renderWithProviders(<LikeCount slug="a" />);
        expect(fetchMock).not.toHaveBeenCalled();

        mockAllIsIntersecting(true);

        expect(await screen.findByLabelText("Лайков: 7")).toHaveTextContent("7");
        expect(fetchMock).toHaveBeenCalledWith("a");
    });

    it("shows nothing for an article without likes", async () => {
        fetchMock.mockResolvedValue(0);
        const { container } = renderWithProviders(<LikeCount slug="a" />);
        mockAllIsIntersecting(true);

        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(container).toHaveTextContent("");
        expect(screen.queryByLabelText(/Лайков/)).not.toBeInTheDocument();
    });
});
