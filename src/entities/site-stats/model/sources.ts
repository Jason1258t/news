/**
 * Откуда пришёл читатель. Первые четыре — внутри сайта, остальные — вход извне.
 * Список совпадает с sourceKeys() в firestore.rules.
 */
export const TRAFFIC_SOURCES = [
    "feed",
    "picks",
    "site",
    "telegram",
    "search",
    "external",
    "direct",
] as const;

export type TrafficSource = (typeof TRAFFIC_SOURCES)[number];

export const TRAFFIC_SOURCE_LABELS: Record<TrafficSource, string> = {
    feed: "Лента на главной",
    picks: "Выбор редакции",
    site: "Другие страницы сайта",
    telegram: "Telegram",
    search: "Поисковики",
    external: "Другие сайты",
    direct: "Прямой заход",
};

export const isTrafficSource = (value: unknown): value is TrafficSource =>
    typeof value === "string" && (TRAFFIC_SOURCES as readonly string[]).includes(value);
