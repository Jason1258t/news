import { z } from "zod";
import { ARTICLE_CATEGORIES, SITE_URL } from "shared/config";

/**
 * Schema of an article as it is uploaded from the admin panel.
 * Single source of truth: TS types are inferred from it and the LLM formatting
 * prompt prints it (see features/copy-article-prompt). Descriptions are addressed
 * to whoever fills the JSON, so they are in Russian.
 */

const inlineHtml = (description = "Текст, допускается inline HTML: <strong>, <em>, <a>") =>
    z.string().describe(description);

export const headingBlockSchema = z
    .object({
        type: z.literal("heading"),
        level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
        text: inlineHtml(),
    })
    .meta({ id: "HeadingBlock", description: "Подзаголовок раздела" });

export const paragraphBlockSchema = z
    .object({
        type: z.literal("paragraph"),
        html: inlineHtml(),
    })
    .meta({ id: "ParagraphBlock", description: "Абзац текста" });

export const listBlockSchema = z
    .object({
        type: z.literal("list"),
        items: z.array(inlineHtml()),
    })
    .meta({ id: "ListBlock", description: "Маркированный список" });

export const imageBlockSchema = z
    .object({
        type: z.literal("image"),
        url: z.string().describe("URL изображения"),
        alt: z.string().describe("Альтернативный текст"),
        caption: z.string().optional().describe("Подпись под изображением"),
    })
    .meta({ id: "ImageBlock", description: "Изображение внутри текста" });

export const blockquoteBlockSchema = z
    .object({
        type: z.literal("blockquote"),
        html: inlineHtml(),
        footer: inlineHtml("Автор или источник цитаты").optional(),
        variant: z.enum(["default", "warning", "critical"]).optional(),
    })
    .meta({ id: "BlockquoteBlock", description: "Цитата или врезка" });

export const highlightBlockSchema = z
    .object({
        type: z.literal("highlight"),
        title: z.string().optional(),
        content: z.array(z.discriminatedUnion("type", [paragraphBlockSchema, listBlockSchema])),
    })
    .meta({ id: "HighlightBlock", description: "Выделенный блок с абзацами и списками" });

export const footerNoteBlockSchema = z
    .object({
        type: z.literal("footer-note"),
        html: inlineHtml(),
    })
    .meta({ id: "FooterNoteBlock", description: "Примечание в конце статьи" });

export const formulaBlockSchema = z
    .object({
        type: z.literal("formula"),
        formula: z.string().describe("Формула в LaTeX"),
        display: z.enum(["inline", "block"]).optional(),
    })
    .meta({ id: "FormulaBlock", description: "Математическая формула" });

export const codeBlockSchema = z
    .object({
        type: z.literal("code"),
        code: z.string(),
        language: z
            .string()
            .optional()
            .describe("Подсветка: javascript, typescript, jsx, tsx, python, java, css, markup"),
        filename: z.string().optional(),
    })
    .meta({ id: "CodeBlock", description: "Блок кода" });

export const tableBlockSchema = z
    .object({
        type: z.literal("table"),
        data: z
            .array(z.array(inlineHtml()))
            .describe("Строки таблицы, ячейки допускают inline HTML"),
        hasHeader: z.boolean().optional().describe("Первая строка — заголовок"),
    })
    .meta({ id: "TableBlock", description: "Таблица" });

export const contentBlockSchema = z
    .discriminatedUnion("type", [
        headingBlockSchema,
        paragraphBlockSchema,
        listBlockSchema,
        imageBlockSchema,
        blockquoteBlockSchema,
        highlightBlockSchema,
        footerNoteBlockSchema,
        formulaBlockSchema,
        codeBlockSchema,
        tableBlockSchema,
    ])
    .meta({ id: "ContentBlock" });

export const articleHeroSchema = z
    .object({
        url: z.string().describe("URL изображения"),
        alt: z.string(),
        caption: z.string().optional(),
    })
    .meta({ id: "Hero", description: "Обложка статьи" });

export const articleOgSchema = z
    .object({
        url: z.string().describe(`Ссылка на статью: ${SITE_URL}/#/articles/<slug>`),
        image: z.string().describe("URL изображения для превью"),
        title: z.string().optional(),
        description: z.string().optional(),
    })
    .meta({ id: "OpenGraph", description: "Превью ссылки в соцсетях и мессенджерах" });

export const articleInputSchema = z
    .object({
        slug: z
            .string()
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
            .describe("Уникальный идентификатор для URL: латиница в нижнем регистре через дефис"),
        title: z.string(),
        description: z.string().describe("Лид: одно-два предложения под заголовком"),
        category: z.array(z.enum(ARTICLE_CATEGORIES)).min(1),
        datePublishedISO: z.string().optional().describe("Дата публикации в ISO 8601"),
        author: z.string(),
        tags: z.array(z.string()),
        hero: articleHeroSchema,
        og: articleOgSchema.optional(),
        content: z.array(contentBlockSchema),
    })
    .meta({ id: "Article", description: "Статья в формате для загрузки" });
