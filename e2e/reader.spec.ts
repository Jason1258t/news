import { allBlocksArticle, seedArticles } from "../emulator/seed-data.ts";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const feedTitles = (page: Page) =>
    page.getByRole("region", { name: "Лента статей" }).getByRole("heading", { level: 3 });

test("home → article with every block type", async ({ page }) => {
    await page.goto("/");
    await expect(feedTitles(page).first()).toHaveText(allBlocksArticle.title);

    await feedTitles(page).first().click();

    await expect(page).toHaveURL(/#\/articles\/all-blocks$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(allBlocksArticle.title);
    await expect(page).toHaveTitle(new RegExp(allBlocksArticle.title));
    // Lazy-loaded renderers kick in: Prism tokens and KaTeX markup.
    await expect(page.locator("code .token").first()).toBeVisible();
    await expect(page.locator(".katex").first()).toBeVisible();
    await expect(page.getByRole("cell", { name: "TypeScript" })).toBeVisible();
    await expect(page.getByText("Критично.")).toBeVisible();
});

test("infinite scroll loads every article once, in order", async ({ page }) => {
    await page.goto("/");
    await expect(feedTitles(page)).toHaveCount(5);

    const end = page.getByText("Больше ничего нет");
    await expect(async () => {
        await feedTitles(page).last().scrollIntoViewIfNeeded();
        await expect(end).toBeVisible({ timeout: 1000 });
    }).toPass();

    await expect(feedTitles(page)).toHaveText(seedArticles.map((article) => article.title));
});

test("article tag → filtered feed → remove the tag", async ({ page }) => {
    await page.goto("/#/articles/football-final");

    await page.getByRole("link", { name: "футбол" }).click();

    await expect(feedTitles(page)).toHaveText([
        "Финал кубка по футболу",
        "Опрос болельщиков",
        "Билеты на стадион",
        "Студенческая лига",
    ]);
    await page.getByRole("button", { name: "Удалить тег футбол" }).click();
    await expect(feedTitles(page)).toHaveCount(5);
});

test("category + tag filter (B15)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation").getByRole("link", { name: "Спорт" }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Спорт" })).toBeVisible();

    await page.goto("/#/?category=Спорт&tags=футбол");

    await expect(feedTitles(page)).toHaveText(["Финал кубка по футболу", "Студенческая лига"]);
});

test("unknown article shows not found", async ({ page }) => {
    await page.goto("/#/articles/no-such-article");

    await expect(page.getByRole("heading", { name: "Статья не найдена" })).toBeVisible();
});

test("editors' pick sidebar lists the picks", async ({ page }) => {
    await page.goto("/");

    const sidebar = page.getByRole("complementary");
    await expect(sidebar.getByRole("link")).toHaveCount(2);
    await expect(sidebar.getByRole("link").first()).toContainText(allBlocksArticle.title);
});

test("mobile menu opens and navigates @mobile", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    const burger = page.getByRole("button", { name: "Меню" });

    await burger.click();
    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("banner").getByRole("link", { name: "Наука" }).click();

    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await expect(feedTitles(page).first()).toHaveText(allBlocksArticle.title);
    await expect(page.getByRole("heading", { level: 2, name: "Наука" })).toBeVisible();
});
