import type { TrafficSource } from "./sources";

/** Счётчики по источникам; источников без данных в объекте нет. */
export type SourceCounts = Partial<Record<TrafficSource, number>>;

/** Счётчики за один день. */
export interface DailyStats {
    /** Дата YYYY-MM-DD по Москве (ID документа). */
    day: string;
    /** Сеансы на сайте: один на вкладку браузера. */
    visits: number;
    /** Сеансы по источнику входа на сайт. */
    entries: SourceCounts;
    /** Просмотры статей по slug: один на статью за сеанс. */
    articles: Record<string, number>;
    /** Просмотры статей по slug и источнику. */
    articleSources: Record<string, SourceCounts>;
    /** Прирост лайков за день: поставленные минус снятые, может быть меньше нуля. */
    likes: number;
}

export interface ArticleViews {
    slug: string;
    views: number;
    /** Из них по ссылке из Telegram. */
    telegram: number;
}

export interface SourceShare {
    /** null — источник неизвестен: просмотры до того, как источники начали считать. */
    source: TrafficSource | null;
    count: number;
}

export interface StatsSummary {
    /** Каждый день периода по порядку, дни без данных — нулями. */
    days: DailyStats[];
    totalVisits: number;
    totalArticleViews: number;
    totalNewLikes: number;
    /** Статьи по убыванию просмотров. */
    topArticles: ArticleViews[];
    /** Сеансы по источнику входа, по убыванию. */
    entrySources: SourceShare[];
    /** Просмотры статей по источнику, по убыванию. */
    articleSources: SourceShare[];
}
