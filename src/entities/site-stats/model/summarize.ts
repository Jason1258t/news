import type { TrafficSource } from "./sources";
import type { ArticleViews, DailyStats, SourceCounts, SourceShare, StatsSummary } from "./types";

const addCounts = (target: Map<TrafficSource, number>, counts: SourceCounts) => {
    for (const [source, count] of Object.entries(counts) as [TrafficSource, number][]) {
        target.set(source, (target.get(source) ?? 0) + count);
    }
};

/** Доли источников по убыванию; разница с `total` — неизвестный источник (старые данные). */
const toShares = (counts: Map<TrafficSource, number>, total: number): SourceShare[] => {
    const shares: SourceShare[] = [...counts]
        .filter(([, count]) => count > 0)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count || a.source!.localeCompare(b.source!));
    const unknown = total - shares.reduce((sum, item) => sum + item.count, 0);
    return unknown > 0 ? [...shares, { source: null, count: unknown }] : shares;
};

/** Сводка за период `days`: недостающие дни заполняются нулями. */
export const summarizeStats = (days: string[], stats: DailyStats[]): StatsSummary => {
    const byDay = new Map(stats.map((item) => [item.day, item]));
    const filled = days.map(
        (day): DailyStats =>
            byDay.get(day) ?? {
                day,
                visits: 0,
                entries: {},
                articles: {},
                articleSources: {},
                likes: 0,
            },
    );

    const views = new Map<string, number>();
    const fromTelegram = new Map<string, number>();
    const entries = new Map<TrafficSource, number>();
    const opens = new Map<TrafficSource, number>();
    for (const day of filled) {
        for (const [slug, count] of Object.entries(day.articles)) {
            views.set(slug, (views.get(slug) ?? 0) + count);
        }
        for (const [slug, counts] of Object.entries(day.articleSources)) {
            addCounts(opens, counts);
            fromTelegram.set(slug, (fromTelegram.get(slug) ?? 0) + (counts.telegram ?? 0));
        }
        addCounts(entries, day.entries);
    }

    const topArticles: ArticleViews[] = [...views]
        .map(([slug, count]) => ({ slug, views: count, telegram: fromTelegram.get(slug) ?? 0 }))
        .sort((a, b) => b.views - a.views || a.slug.localeCompare(b.slug));

    const totalVisits = filled.reduce((sum, item) => sum + item.visits, 0);
    const totalArticleViews = topArticles.reduce((sum, item) => sum + item.views, 0);

    return {
        days: filled,
        totalVisits,
        totalArticleViews,
        totalNewLikes: filled.reduce((sum, item) => sum + item.likes, 0),
        topArticles,
        entrySources: toShares(entries, totalVisits),
        articleSources: toShares(opens, totalArticleViews),
    };
};
