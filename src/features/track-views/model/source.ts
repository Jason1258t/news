import { isTrafficSource, type TrafficSource } from "entities/site-stats";

/** Параметр ссылки с источником: ?from=tg в постах канала, ?from=picks у выбора редакции. */
const FROM_PARAM = "from";
const FROM_ALIASES: Record<string, TrafficSource> = { tg: "telegram", picks: "picks" };

const TELEGRAM_HOSTS = ["t.me", "telegram.org", "telegram.me"];
const SEARCH_HOSTS = ["google.", "yandex.", "ya.ru", "bing.com", "duckduckgo.com", "go.mail.ru"];

const matchesHost = (host: string, patterns: string[]) =>
    patterns.some((pattern) =>
        pattern.endsWith(".")
            ? host.startsWith(pattern) || host.includes(`.${pattern}`)
            : host === pattern || host.endsWith(`.${pattern}`),
    );

/** Источник из ?from=…; у HashRouter параметры живут и после «#», поэтому смотрим оба места. */
const sourceFromUrl = (url: URL): TrafficSource | null => {
    const hashQuery = url.hash.includes("?") ? url.hash.slice(url.hash.indexOf("?")) : "";
    for (const params of [new URLSearchParams(hashQuery), url.searchParams]) {
        const from = params.get(FROM_PARAM);
        if (from) return FROM_ALIASES[from] ?? (isTrafficSource(from) ? from : null);
    }
    return null;
};

/**
 * Откуда пришли на первую страницу вкладки. Telegram обычно не передаёт referrer, поэтому
 * его ссылки помечены ?from=tg; без метки такой переход выглядит как прямой заход.
 */
export const getLandingSource = (href: string, referrer: string): TrafficSource => {
    const url = new URL(href);
    const tagged = sourceFromUrl(url);
    if (tagged) return tagged;
    if (!referrer) return "direct";

    let host: string;
    try {
        host = new URL(referrer).hostname;
    } catch {
        return "direct";
    }
    if (host === url.hostname) return "site";
    if (matchesHost(host, TELEGRAM_HOSTS)) return "telegram";
    if (matchesHost(host, SEARCH_HOSTS)) return "search";
    return "external";
};

/** Состояние ссылки внутри сайта, по которому просмотр статьи узнаёт, откуда перешли. */
export const linkFrom = (source: TrafficSource) => ({ from: source });

/** Источник перехода внутри сайта; ссылки без метки считаются «другими страницами сайта». */
export const getInternalSource = (state: unknown): TrafficSource => {
    const from = (state as { from?: unknown } | null)?.from;
    return isTrafficSource(from) ? from : "site";
};

/** Добавляет ?from=… к ссылке, которая открывается в новой вкладке (там нет состояния роутера). */
export const withFromParam = (to: string, source: keyof typeof FROM_ALIASES) =>
    `${to}${to.includes("?") ? "&" : "?"}${FROM_PARAM}=${source}`;
