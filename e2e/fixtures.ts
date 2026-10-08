import { test as base, expect, type Page } from "@playwright/test";
import { SEED_ADMIN } from "../emulator/seed-data.ts";
import { seedEmulators } from "../emulator/seed.ts";

/** Every test starts from freshly seeded emulators. */
export const test = base.extend<{ seed: void }>({
    seed: [
        async ({}, use) => {
            await seedEmulators();
            await use();
        },
        { auto: true },
    ],
});

export { expect };

export const login = async (page: Page, path = "/#/admin") => {
    await page.goto(path);
    await expect(page).toHaveURL(/#\/login$/);
    await page.getByLabel("Email").fill(SEED_ADMIN.email);
    await page.getByLabel("Пароль").fill(SEED_ADMIN.password);
    await page.getByRole("button", { name: "Войти" }).click();
};
