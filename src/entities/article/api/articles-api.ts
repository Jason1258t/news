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
import { getErrorMessage } from "shared/lib/error";
import { mapArticleFromFirestore } from "../model/mappers";
import type { Article } from "../model/types";
import { validateArticleData } from "../model/validators";
import { getArticlesQuery } from "./articles-query";

export type MutationResult<T = object> =
    ({ success: true } & T) | { success: false; error: string };

/** Article JSON as pasted in the admin panel; validated before saving. */
export type ArticleCreateData = Record<string, unknown> & { slug: string };

/** Создаёт новую статью в Firestore. */
export const createArticle = async (
    articleData: ArticleCreateData,
): Promise<MutationResult<{ slug: string }>> => {
    try {
        validateArticleData(articleData);

        const existingDoc = await getDoc(doc(db, "articles", articleData.slug));
        if (existingDoc.exists()) {
            throw new Error(`Статья с slug "${articleData.slug}" уже существует`);
        }

        const articleToSave = prepareArticleToSave(articleData);

        const docRef = doc(db, "articles", articleData.slug);
        await setDoc(docRef, articleToSave);

        return {
            success: true,
            slug: articleData.slug,
        };
    } catch (error) {
        console.error("❌ Ошибка при создании статьи:", error);
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

const prepareArticleToSave = (articleData: ArticleCreateData) => {
    const { dateDisplay: _dateDisplay, ...rest } = articleData;
    return {
        ...rest,
        datePublishedISO: articleData.datePublishedISO || new Date().toISOString(),
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
}

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

        const hasMore = querySnapshot.docs.length === limit;

        return {
            data: querySnapshot.docs.map((snapshot) => mapArticleFromFirestore(snapshot)),
            hasMore: hasMore,
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
export const deleteArticle = async (slug: string): Promise<MutationResult> => {
    try {
        if (!slug || typeof slug !== "string") {
            throw new Error("Некорректный slug статьи");
        }

        const docRef = doc(db, "articles", slug);
        const articleDoc = await getDoc(docRef);

        if (!articleDoc.exists()) {
            throw new Error(`Статья с slug "${slug}" не найдена`);
        }

        await deleteDoc(docRef);
        return {
            success: true,
        };
    } catch (error) {
        console.error("❌ Ошибка при удалении статьи:", error);
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};
