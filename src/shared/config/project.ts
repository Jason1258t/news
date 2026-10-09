export const PROJECT_NAME = "ПГТУ Брбрбр NEWS";

export const SITE_URL = "https://vtech-news.ru";

export const TELEGRAM_CHANNEL_URL = "https://t.me/pgtu_breaking_news";

export const ARTICLE_CATEGORIES = ["Наука", "Общество", "Технологии", "Спорт"] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];
