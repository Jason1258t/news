import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchArticleBySlug } from "entities/article";
import { fetchAllLikeCounts } from "entities/article-like";
import { fetchDailyStats, getLastDays } from "entities/site-stats";
import { makeArticle } from "test/fixtures";
import { renderWithProviders } from "test/render";
import { AnalyticsPage } from "./AnalyticsPage";

vi.mock("entities/site-stats/api/stats-api", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    fetchDailyStats: vi.fn(),
}));
vi.mock("entities/article/api/articles-api", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    fetchArticleBySlug: vi.fn(),
}));

vi.mock("entities/article-like/api/likes-api", () => ({ fetchAllLikeCounts: vi.fn() }));

const statsMock = vi.mocked(fetchDailyStats);
const likesMock = vi.mocked(fetchAllLikeCounts);
const articleMock = vi.mocked(fetchArticleBySlug);

describe("AnalyticsPage", () => {
    beforeEach(() => {
        const [yesterday, today] = getLastDays(2);
        statsMock.mockReset().mockResolvedValue([
            { day: yesterday!, visits: 10, articles: { popular: 5, gone: 1 } },
            { day: today!, visits: 20, articles: { popular: 3, other: 4 } },
        ]);
        likesMock.mockReset().mockResolvedValue([
            { slug: "other", likes: 6 },
            { slug: "popular", likes: 2 },
        ]);
        articleMock
            .mockReset()
            .mockImplementation(async (slug) =>
                slug === "gone" ? null : makeArticle({ slug, title: `Статья ${slug}` }),
            );
    });

    it("shows totals for the last 30 days by default", async () => {
        renderWithProviders(<AnalyticsPage />);

        expect(await screen.findByText("Сеансы")).toBeInTheDocument();
        expect(screen.getByText("30").closest("div")).toHaveTextContent("Сеансы30");
        expect(screen.getByText("Просмотры статей").closest("div")).toHaveTextContent("13");
        expect(screen.getByText("Сеансов в день").closest("div")).toHaveTextContent("1");

        const days = getLastDays(30);
        expect(statsMock).toHaveBeenCalledWith(days[0], days[29]);
        expect(screen.getAllByRole("listitem")).toHaveLength(30);
    });

    it("ranks articles by views and marks deleted ones", async () => {
        renderWithProviders(<AnalyticsPage />);

        const rows = await screen.findAllByRole("row");
        expect(await within(rows[1]!).findByRole("link")).toHaveTextContent("Статья popular");
        expect(rows[1]).toHaveTextContent("8");
        expect(await within(rows[2]!).findByRole("link")).toHaveTextContent("Статья other");
        expect(await screen.findByText("gone (удалена)")).toBeInTheDocument();
    });

    it("adds all-time likes: a tile, a column and the most liked list", async () => {
        renderWithProviders(<AnalyticsPage />);

        expect((await screen.findByText("Лайки за всё время")).closest("div")).toHaveTextContent(
            "8",
        );

        const popular = within(screen.getByRole("region", { name: "Популярные статьи" }));
        const [, first, second, third] = popular.getAllByRole("row");
        expect(first!.lastElementChild).toHaveTextContent("2");
        expect(second!.lastElementChild).toHaveTextContent("6");
        expect(third!.lastElementChild).toHaveTextContent("0");

        const liked = within(screen.getByRole("region", { name: /Больше всего лайков/ }));
        const [, top, next] = await liked.findAllByRole("row");
        expect(await within(top!).findByRole("link")).toHaveTextContent("Статья other");
        expect(top).toHaveTextContent("6");
        expect(await within(next!).findByRole("link")).toHaveTextContent("Статья popular");
    });

    it("keeps the stats when likes fail to load", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        likesMock.mockRejectedValue(new Error("boom"));
        renderWithProviders(<AnalyticsPage />);

        expect(await screen.findByText("Не удалось загрузить лайки.")).toBeInTheDocument();
        expect(screen.getByText("Лайки за всё время").closest("div")).toHaveTextContent("—");
        expect(screen.getByText("Просмотры статей").closest("div")).toHaveTextContent("13");
    });

    it("reloads for another period", async () => {
        renderWithProviders(<AnalyticsPage />);
        await screen.findByText("Сеансы");

        await userEvent.click(screen.getByRole("button", { name: "7 дн." }));

        const days = getLastDays(7);
        expect(statsMock).toHaveBeenLastCalledWith(days[0], days[6]);
        expect(screen.getByRole("button", { name: "7 дн." })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
    });

    it("says when no article was opened", async () => {
        statsMock.mockResolvedValue([]);
        renderWithProviders(<AnalyticsPage />);

        expect(await screen.findByText("За этот период статьи не открывали.")).toBeInTheDocument();
    });

    it("shows the error from the API", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        statsMock.mockRejectedValue(new Error("Не удалось загрузить статистику"));
        renderWithProviders(<AnalyticsPage />);

        expect(await screen.findByText("Не удалось загрузить статистику")).toBeInTheDocument();
    });
});
