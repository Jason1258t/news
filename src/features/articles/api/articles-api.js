import {
    getDocs,
    getDoc,
    doc,
    setDoc,
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

export const fetchArticles = async (category) => {
    try {
        const articlesQuery = getArticlesQuery(category);
        const querySnapshot = await getDocs(articlesQuery);

        return querySnapshot.docs.map((doc) => mapArticleFromFirestore(doc));
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw new Error("Failed to fetch articles");
    }
};

export const fetchArticleBySlug = async (slug) => {
    try {
        const docRef = doc(db, "articles", slug);
        const docSnap = await getDoc(docRef);

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
