import {
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    setDoc,
    type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "shared/api";
import { toFirestoreContent } from "../model/firestore-content";
import { mapArticleFromFirestore } from "../model/mappers";
import type { Article, ArticleInput } from "../model/types";
import { parseArticleInput } from "../model/validators";
import { getArticlesQuery, needsClientCategoryFilter } from "./articles-query";

/** Создаёт статью из JSON, вставленного в админке; формат проверяется по схеме. */
export const createArticle = async (articleData: unknown): Promise<{ slug: string }> => {
    const article = parseArticleInput(articleData);

    const existingDoc = await getDoc(doc(db, "articles", article.slug));
    if (existingDoc.exists()) {
        throw new Error(`Статья с slug "${article.slug}" уже существует`);
    }

    await setDoc(doc(db, "articles", article.slug), prepareArticleToSave(article));
    return { slug: article.slug };
};

const prepareArticleToSave = (article: ArticleInput) => {
    return {
        ...article,
        content: toFirestoreContent(article.content),
        datePublishedISO: article.datePublishedISO || new Date().toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
};

export interface FetchArticlesParams {
    category?: string | null;
    /** Slug of the last article of the previous page. */
    lastId?: string;
    limit?: number;
    tags?: string[];
}

export interface ArticlesPage {
    data: Article[];
    hasMore: boolean;
    /** Slug of the last fetched document; it can differ from the last item of `data` when filtering on the client. */
    nextCursor?: string;
}

const hasCategory = (snapshot: DocumentSnapshot, category: string) => {
    const categories: unknown = snapshot.get("category");
    return Array.isArray(categories) && categories.includes(category);
};

export const fetchArticles = async ({
    category,
    lastId,
    limit = 5,
    tags = undefined,
}: FetchArticlesParams): Promise<ArticlesPage> => {
    try {
        let cursor: DocumentSnapshot | undefined = undefined;
        if (lastId) {
            cursor = await fetchArticleDocBySlug(lastId);
        }

        const articlesQuery = getArticlesQuery(category, tags, limit, cursor);
        const querySnapshot = await getDocs(articlesQuery);

        const docs =
            category && needsClientCategoryFilter(category, tags)
                ? querySnapshot.docs.filter((snapshot) => hasCategory(snapshot, category))
                : querySnapshot.docs;

        return {
            data: docs.map((snapshot) => mapArticleFromFirestore(snapshot)),
            hasMore: querySnapshot.docs.length === limit,
            nextCursor: querySnapshot.docs.at(-1)?.id,
        };
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw new Error("Failed to fetch articles", { cause: error });
    }
};

const fetchArticleDocBySlug = async (slug: string) => {
    const docRef = doc(db, "articles", slug);
    return await getDoc(docRef);
};

/** Статья по slug; null, если её нет. */
export const fetchArticleBySlug = async (slug: string): Promise<Article | null> => {
    try {
        const docSnap = await fetchArticleDocBySlug(slug);
        return docSnap.exists() ? mapArticleFromFirestore(docSnap) : null;
    } catch (error) {
        console.error(`Error fetching article ${slug}:`, error);
        throw new Error("Failed to fetch article", { cause: error });
    }
};

/** Удаляет статью из Firestore. */
export const deleteArticle = async (slug: string): Promise<void> => {
    if (!slug) {
        throw new Error("Некорректный slug статьи");
    }

    const docRef = doc(db, "articles", slug);
    const articleDoc = await getDoc(docRef);
    if (!articleDoc.exists()) {
        throw new Error(`Статья с slug "${slug}" не найдена`);
    }

    await deleteDoc(docRef);
};
