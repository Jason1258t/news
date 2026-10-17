import type { ArticleViews, DailyStats, StatsSummary } from "./types";

/** Сводка за период `days`: недостающие дни заполняются нулями. */
export const summarizeStats = (days: string[], stats: DailyStats[]): StatsSummary => {
    const byDay = new Map(stats.map((item) => [item.day, item]));
    const filled = days.map((day) => byDay.get(day) ?? { day, visits: 0, articles: {}, likes: 0 });

    const views = new Map<string, number>();
    for (const { articles } of filled) {
        for (const [slug, count] of Object.entries(articles)) {
            views.set(slug, (views.get(slug) ?? 0) + count);
        }
    }

    const topArticles: ArticleViews[] = [...views]
        .map(([slug, count]) => ({ slug, views: count }))
        .sort((a, b) => b.views - a.views || a.slug.localeCompare(b.slug));

    return {
        days: filled,
        totalVisits: filled.reduce((sum, item) => sum + item.visits, 0),
        totalArticleViews: topArticles.reduce((sum, item) => sum + item.views, 0),
        totalNewLikes: filled.reduce((sum, item) => sum + item.likes, 0),
        topArticles,
    };
};
