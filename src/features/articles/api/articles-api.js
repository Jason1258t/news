import {
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "app/firebase";
import { mapArticleFromFirestore } from "entities/article/model/mappers";
import { validateArticleData } from "./validators";
import { getArticlesQuery } from "./queries";

/**
 * Создает новую статью в Firestore
 * @param {Object} articleData - Данные статьи
 * @returns {Promise<{success: boolean, slug?: string, error?: string}>}
 */
export const createArticle = async (articleData) => {
    try {
        validateArticleData(articleData);

        const existingDoc = await getDoc(doc(db, "articles", articleData.slug));
        if (existingDoc.exists()) {
            throw new Error(
                `Статья с slug "${articleData.slug}" уже существует`
            );
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
            error: error.message,
        };
    }
};

const prepareArticleToSave = (articleData) => {
    const articleToSave = {
        ...articleData,
        datePublishedISO:
            articleData.datePublishedISO || new Date().toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    delete articleToSave.dateDisplay;
    return articleToSave;
};

export const fetchArticles = async (category, lastId, limit = 5) => {
    try {
        let doc = undefined;
        if (lastId) {
            doc = await fetchArticleDocBySlug(lastId);
        }

        const articlesQuery = getArticlesQuery(category, limit, doc);
        const querySnapshot = await getDocs(articlesQuery);

        const hasMore = querySnapshot.docs.length === limit;

        return {
            data: querySnapshot.docs.map((doc) => mapArticleFromFirestore(doc)),
            hasMore: hasMore,
        };
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw new Error("Failed to fetch articles");
    }
};

const fetchArticleDocBySlug = async (slug) => {
    const docRef = doc(db, "articles", slug);
    return await getDoc(docRef);
};

export const fetchArticleBySlug = async (slug) => {
    try {
        const docSnap = await fetchArticleDocBySlug(slug);
        if (docSnap.exists()) {
            return mapArticleFromFirestore(docSnap);
        } else {
            throw new Error("Article not found");
        }
    } catch (error) {
        console.error(`Error fetching article ${slug}:`, error);
        throw new Error("Failed to fetch article");
    }
};

/**
 * Удаляет статью из Firestore
 * @param {string} slug - Slug статьи для удаления
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteArticle = async (slug) => {
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
            error: error.message,
        };
    }
};
