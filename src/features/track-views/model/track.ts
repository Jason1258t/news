import { recordArticleView, recordVisit, type TrafficSource } from "entities/site-stats";

/** Считаем только на боевом сайте: dev-сервер и эмуляторы статистику не трогают. */
export const isTrackingEnabled = () =>
    import.meta.env.PROD && import.meta.env.VITE_FIREBASE_EMULATORS !== "true";

/**
 * Выполняет `record` один раз за сеанс вкладки для ключа `key`. Без sessionStorage
 * (приватный режим, запрет cookies) просто считает каждый раз.
 */
const oncePerSession = (key: string, record: () => Promise<unknown>) => {
    const storageKey = `stats:${key}`;
    try {
        if (sessionStorage.getItem(storageKey)) return;
        sessionStorage.setItem(storageKey, "1");
    } catch {
        // storage недоступен
    }
    // Аналитика не должна мешать читателю: ошибки записи молча игнорируются.
    record().catch(() => {});
};

export const trackVisit = (source: TrafficSource) =>
    oncePerSession("visit", () => recordVisit(source));

export const trackArticleView = (slug: string, source: TrafficSource) =>
    oncePerSession(`article:${slug}`, () => recordArticleView(slug, source));
