import { describe, expect, it } from "vitest";
import { articleInputSchema } from "entities/article";
import { ARTICLE_CATEGORIES, PROJECT_NAME, SITE_URL, TELEGRAM_CHANNEL_URL } from "shared/config";
import exampleArticle from "../prompts/example-article.json";
import {
    buildArticleFormatPrompt,
    buildTelegramPostPrompt,
    getMissingPublicationFields,
} from "./build-prompts";

const BLOCK_TYPES = [
    "HeadingBlock",
    "ParagraphBlock",
    "ListBlock",
    "ImageBlock",
    "BlockquoteBlock",
    "HighlightBlock",
    "FooterNoteBlock",
    "FormulaBlock",
    "CodeBlock",
    "TableBlock",
];

describe("example article", () => {
    it("matches the article schema, so the prompt never shows an outdated example", () => {
        const result = articleInputSchema.safeParse(exampleArticle);
        expect(result.error?.issues ?? []).toEqual([]);
    });
});

describe("buildArticleFormatPrompt", () => {
    const prompt = buildArticleFormatPrompt({
        publishDate: "2026-10-08T12:30:00.000Z",
        imageUrl: "https://img.example/cover.jpg",
    });

    it("leaves no unfilled placeholders", () => {
        expect(prompt).not.toMatch(/\{\{.*?\}\}/);
    });

    it("includes the types generated from the schema", () => {
        expect(prompt).toContain("type Article = {");
        for (const name of BLOCK_TYPES) {
            expect(prompt).toContain(`type ${name} = {`);
        }
    });

    it("includes project settings", () => {
        expect(prompt).toContain(ARTICLE_CATEGORIES.join(", "));
        expect(prompt).toContain(`«${PROJECT_NAME}»`);
        expect(prompt).toContain(`${SITE_URL}/#/articles/<slug>`);
    });

    it("embeds the example with the current project name as author", () => {
        expect(prompt).toContain(`"slug": "${exampleArticle.slug}"`);
        expect(prompt).toContain(`"author": "${PROJECT_NAME}"`);
    });

    it("passes publication data", () => {
        expect(prompt).toContain("Дата публикации: 2026-10-08T12:30:00.000Z");
        expect(prompt).toContain("Изображение: https://img.example/cover.jpg");
    });

    it("asks to warn about missing publication data", () => {
        const empty = buildArticleFormatPrompt();
        expect(empty).toContain("Дата публикации не указана");
        expect(empty).toContain("Изображение не указано");
    });

    it("converts a Date to ISO", () => {
        const fromDate = buildArticleFormatPrompt({
            publishDate: new Date("2026-01-02T03:04:05Z"),
        });
        expect(fromDate).toContain("Дата публикации: 2026-01-02T03:04:05.000Z");
    });
});

describe("getMissingPublicationFields", () => {
    it.each([
        [{}, ["дата публикации", "изображение"]],
        [{ publishDate: "not a date", imageUrl: "x" }, ["дата публикации"]],
        [{ publishDate: new Date(), imageUrl: "" }, ["изображение"]],
        [{ publishDate: "2026-10-08T10:00", imageUrl: "x" }, []],
    ])("%j → %j", (info, expected) => {
        expect(getMissingPublicationFields(info)).toEqual(expected);
    });
});

describe("buildTelegramPostPrompt", () => {
    it("fills site and channel links", () => {
        const prompt = buildTelegramPostPrompt();
        expect(prompt).not.toMatch(/\{\{.*?\}\}/);
        expect(prompt).toContain(`${SITE_URL}/#/articles/`);
        expect(prompt).toContain(TELEGRAM_CHANNEL_URL);
    });
});
