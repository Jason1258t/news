/** Счётчики за один день. */
export interface DailyStats {
    /** Дата YYYY-MM-DD по Москве (ID документа). */
    day: string;
    /** Сеансы на сайте: один на вкладку браузера. */
    visits: number;
    /** Просмотры статей по slug: один на статью за сеанс. */
    articles: Record<string, number>;
    /** Прирост лайков за день: поставленные минус снятые, может быть меньше нуля. */
    likes: number;
}

export interface ArticleViews {
    slug: string;
    views: number;
}

export interface StatsSummary {
    /** Каждый день периода по порядку, дни без данных — нулями. */
    days: DailyStats[];
    totalVisits: number;
    totalArticleViews: number;
    totalNewLikes: number;
    /** Статьи по убыванию просмотров. */
    topArticles: ArticleViews[];
}
