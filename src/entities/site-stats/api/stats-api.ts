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
import type { DailyStats } from "../model/types";

const COLLECTION = "stats";

const toCount = (value: unknown) => (typeof value === "number" && value > 0 ? value : 0);

export const mapDailyStatsFromFirestore = (snapshot: DocumentSnapshot): DailyStats => {
    const data = snapshot.data() ?? {};
    const articles = (data.articles ?? {}) as Record<string, unknown>;
    return {
        day: snapshot.id,
        visits: toCount(data.visits),
        likes: typeof data.likes === "number" ? data.likes : 0,
        articles: Object.fromEntries(
            Object.entries(articles).map(([slug, count]) => [slug, toCount(count)]),
        ),
    };
};

const today = () => doc(db, COLLECTION, getStatsDay());

/** +1 сеанс за сегодня. Правила разрешают читателю только такое изменение. */
export const recordVisit = () => setDoc(today(), { visits: increment(1) }, { merge: true });

/** +1 просмотр статьи за сегодня. lastArticle нужен правилам, чтобы проверить, какой счётчик вырос. */
export const recordArticleView = (slug: string) =>
    setDoc(today(), { articles: { [slug]: increment(1) }, lastArticle: slug }, { merge: true });

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
