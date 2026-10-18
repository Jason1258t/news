import {
    collection,
    doc,
    documentId,
    getDocs,
    increment,
    query,
    setDoc,
    where,
    type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "shared/api";
import { getStatsDay } from "shared/lib/date";
import { isTrafficSource, type TrafficSource } from "../model/sources";
import type { DailyStats, SourceCounts } from "../model/types";

const COLLECTION = "stats";

const toCount = (value: unknown) => (typeof value === "number" && value > 0 ? value : 0);

const toSourceCounts = (value: unknown): SourceCounts =>
    Object.fromEntries(
        Object.entries((value ?? {}) as Record<string, unknown>)
            .filter(([source]) => isTrafficSource(source))
            .map(([source, count]) => [source, toCount(count)]),
    );

export const mapDailyStatsFromFirestore = (snapshot: DocumentSnapshot): DailyStats => {
    const data = snapshot.data() ?? {};
    const articles = (data.articles ?? {}) as Record<string, unknown>;
    return {
        day: snapshot.id,
        visits: toCount(data.visits),
        entries: toSourceCounts(data.entries),
        articleSources: Object.fromEntries(
            Object.entries((data.articleSources ?? {}) as Record<string, unknown>).map(
                ([slug, counts]) => [slug, toSourceCounts(counts)],
            ),
        ),
        likes: typeof data.likes === "number" ? data.likes : 0,
        articles: Object.fromEntries(
            Object.entries(articles).map(([slug, count]) => [slug, toCount(count)]),
        ),
    };
};

const today = () => doc(db, COLLECTION, getStatsDay());

/**
 * +1 сеанс за сегодня и +1 к его источнику. Правила разрешают читателю только такое изменение;
 * lastEntry нужен им, чтобы проверить, какой счётчик в entries вырос.
 */
export const recordVisit = (source: TrafficSource) =>
    setDoc(
        today(),
        { visits: increment(1), entries: { [source]: increment(1) }, lastEntry: source },
        { merge: true },
    );

/**
 * +1 просмотр статьи за сегодня, в том числе по её источнику. lastArticle и lastSource нужны
 * правилам, чтобы проверить, какие счётчики выросли.
 */
export const recordArticleView = (slug: string, source: TrafficSource) =>
    setDoc(
        today(),
        {
            articles: { [slug]: increment(1) },
            articleSources: { [slug]: { [source]: increment(1) } },
            lastArticle: slug,
            lastSource: source,
        },
        { merge: true },
    );

/** Счётчики за дни с `from` по `to` включительно (YYYY-MM-DD). Доступно только админу. */
export const fetchDailyStats = async (from: string, to: string): Promise<DailyStats[]> => {
    try {
        const snapshot = await getDocs(
            query(
                collection(db, COLLECTION),
                where(documentId(), ">=", from),
                where(documentId(), "<=", to),
            ),
        );
        return snapshot.docs.map(mapDailyStatsFromFirestore);
    } catch (error) {
        console.error("❌ Ошибка при получении статистики:", error);
        throw new Error("Не удалось загрузить статистику", { cause: error });
    }
};
