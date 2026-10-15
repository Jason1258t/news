/** Сайт русскоязычный, поэтому сутки считаются по Москве (UTC+3, без перехода на летнее время). */
const MOSCOW_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Дата YYYY-MM-DD по Москве — ID документа со счётчиками этого дня. */
export const getStatsDay = (date: Date = new Date()): string =>
    new Date(date.getTime() + MOSCOW_OFFSET_MS).toISOString().slice(0, 10);

/** Последние `count` дней, включая сегодняшний, от старого к новому. */
export const getLastDays = (count: number, now: Date = new Date()): string[] =>
    Array.from({ length: count }, (_, i) =>
        getStatsDay(new Date(now.getTime() - (count - 1 - i) * DAY_MS)),
    );
