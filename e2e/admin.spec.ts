import { allBlocksArticle } from "../emulator/seed-data.ts";
import { expect, login, test } from "./fixtures";

test("guest is sent to login and back to the requested admin page", async ({ page }) => {
    await login(page, "/#/admin/studio");

    await expect(page).toHaveURL(/#\/admin\/studio$/);
    await expect(page.getByRole("heading", { name: "Студия" })).toBeVisible();
});

test("wrong password shows an error", async ({ page }) => {
    await page.goto("/#/login");
    await page.getByLabel("Email").fill("admin@news.test");
    await page.getByLabel("Пароль").fill("wrong-password");
    await page.getByRole("button", { name: "Войти" }).click();

    await expect(page.getByRole("alert")).toHaveText("Неверный email или пароль");
});

test("create an article from JSON, then delete it", async ({ page }) => {
    await login(page, "/#/admin/create-article");
    const article = { ...allBlocksArticle, slug: "e2e-article", title: "Статья из e2e" };

    await page.getByLabel("JSON данные статьи").fill(JSON.stringify(article));
    await expect(page.getByText("JSON валиден")).toBeVisible();
    await page.getByRole("button", { name: /Создать статью/ }).click();

    // Lands on the new article; tables survive the Firestore round trip.
    await expect(page).toHaveURL(/#\/articles\/e2e-article$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Статья из e2e");
    await expect(page.getByRole("cell", { name: "Python" })).toBeVisible();

    await page.goto("/#/admin/articles-panel");
    await page.getByRole("button", { name: /Статья из e2e/ }).click();
    await page.getByRole("button", { name: "Удалить", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Удалить статью?" });
    await dialog.getByRole("button", { name: "Удалить" }).click();

    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: /Статья из e2e/ })).toBeHidden();
    await page.goto("/#/articles/e2e-article");
    await expect(page.getByRole("heading", { name: "Статья не найдена" })).toBeVisible();
});

test("invalid article JSON is explained and not uploaded", async ({ page }) => {
    await login(page, "/#/admin/create-article");
    const input = page.getByLabel("JSON данные статьи");

    await input.fill("{ broken");
    await expect(page.getByText(/Невалидный JSON/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Создать статью/ })).toBeDisabled();

    await input.fill(JSON.stringify({ ...allBlocksArticle, slug: "Bad Slug" }));
    await page.getByRole("button", { name: /Создать статью/ }).click();
    await expect(page.getByRole("alert")).toContainText("slug");
    await expect(page).toHaveURL(/create-article$/);
});

test("editors' pick: add an article, change its badge, save", async ({ page }) => {
    await login(page, "/#/admin/editors-pick");
    const current = page.getByRole("region", { name: "Текущий выбор редакции" });
    await expect(current.getByRole("heading", { level: 4 })).toHaveCount(2);

    await page.getByRole("button", { name: "Миссия на Марс" }).click();
    await expect(current.getByRole("heading", { level: 4 })).toHaveCount(3);
    await current.getByRole("button", { name: "Изменить бейдж" }).last().click();
    const dialog = page.getByRole("dialog", { name: "Выберите бейдж" });
    await dialog.getByRole("button", { name: "Research" }).click();
    await dialog.getByRole("button", { name: "Подтвердить" }).click();
    await current.getByRole("button", { name: "Подтвердить" }).click();

    await expect(page.getByText("Выбор редакции сохранён")).toBeVisible();
    await page.goto("/");
    const sidebar = page.getByRole("complementary");
    await expect(sidebar.getByRole("link")).toHaveCount(3);
    await expect(sidebar.getByRole("link").last()).toContainText("Research");
    await expect(sidebar.getByRole("link").last()).toContainText("Миссия на Марс");
});

test("studio: add, complete and delete a todo", async ({ page }) => {
    await login(page, "/#/admin/studio");

    await page.getByLabel("Новая задача").fill("Задача из e2e");
    await page.getByRole("button", { name: "Добавить" }).click();
    // The checkbox follows Firestore, so it flips once the write comes back through the subscription.
    await page.getByRole("checkbox", { name: "Задача из e2e" }).click();
    await page.getByRole("button", { name: "Завершённые" }).click();
    await expect(page.getByRole("checkbox", { name: "Задача из e2e" })).toBeChecked();

    await page.getByRole("button", { name: "Удалить: Задача из e2e" }).click();
    await expect(page.getByRole("checkbox", { name: "Задача из e2e" })).toBeHidden();
    await expect(page.getByText("Всего: 2")).toBeVisible();
});

test("logout returns to the login page", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: "Выйти" }).click();

    await expect(page).toHaveURL(/#\/login$/);
    await page.goto("/#/admin/studio");
    await expect(page).toHaveURL(/#\/login$/);
});
