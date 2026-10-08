import { articleInputSchema } from "entities/article";
import { ARTICLE_CATEGORIES, PROJECT_NAME, SITE_URL, TELEGRAM_CHANNEL_URL } from "shared/config";
import { printSchemaTypes } from "shared/lib/schema-to-ts";
import { renderTemplate } from "shared/lib/template";
import exampleArticle from "../prompts/example-article.json";
import articleFormatTemplate from "../prompts/article-format.md?raw";
import telegramPostTemplate from "../prompts/telegram-post.md?raw";

export interface PublicationInfo {
    /** Дата из пикера: Date или строка datetime-local. */
    publishDate?: Date | string | null;
    imageUrl?: string | null;
}

const toIsoString = (value: Date | string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

/** Человекочитаемые названия незаполненных полей публикации. */
export const getMissingPublicationFields = ({ publishDate, imageUrl }: PublicationInfo) => {
    const missing: string[] = [];
    if (!publishDate || !toIsoString(publishDate)) missing.push("дата публикации");
    if (!imageUrl) missing.push("изображение");
    return missing;
};

const buildPublicationSection = ({ publishDate, imageUrl }: PublicationInfo) => {
    const iso = publishDate ? toIsoString(publishDate) : null;
    return [
        iso
            ? `- Дата публикации: ${iso} — запиши её в \`datePublishedISO\`.`
            : "- Дата публикации не указана — предупреди меня об этом и не заполняй `datePublishedISO`: при загрузке подставится текущее время.",
        imageUrl
            ? `- Изображение: ${imageUrl} — используй его в \`hero.url\` и \`og.image\`.`
            : "- Изображение не указано — предупреди меня об этом.",
    ].join("\n");
};

/** Промпт для LLM: превратить текст статьи в JSON по схеме статьи. */
export const buildArticleFormatPrompt = (publication: PublicationInfo = {}) =>
    renderTemplate(articleFormatTemplate, {
        projectName: PROJECT_NAME,
        siteUrl: SITE_URL,
        categories: ARTICLE_CATEGORIES.join(", "),
        types: printSchemaTypes(articleInputSchema),
        publication: buildPublicationSection(publication),
        example: JSON.stringify({ ...exampleArticle, author: PROJECT_NAME }, null, 4),
    });

/** Промпт для LLM: написать по статье пост для Telegram-канала. */
export const buildTelegramPostPrompt = () =>
    renderTemplate(telegramPostTemplate, {
        siteUrl: SITE_URL,
        telegramUrl: TELEGRAM_CHANNEL_URL,
    });
