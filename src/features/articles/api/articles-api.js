import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    orderBy,
    where,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "app/firebase";
import { formatDate } from "shared/lib/date-utils";

const mapArticleFromFirestore = (doc) => {
    const data = doc.data();
    return {
        slug: doc.id,
        title: data.title || "",
        description: data.description || "",
        category: (data.category || []).join(" • "),
        dateDisplay: formatDate(data.datePublishedISO),
        datePublishedISO: data.datePublishedISO || new Date().toISOString(),
        author: data.author || "",
        tags: data.tags || [],
        hero: data.hero || { url: "", alt: "" },
        og: data.og || {},
        content: data.content || [],
    };
};

/**
 * Создает новую статью в Firestore
 * @param {Object} articleData - Данные статьи
 * @returns {Promise<{success: boolean, slug?: string, error?: string}>}
 */
export const createArticle = async (articleData) => {
    try {
        if (!articleData.slug) {
            throw new Error("Поле 'slug' обязательно для заполнения");
        }

        if (!articleData.title) {
            throw new Error("Поле 'title' обязательно для заполнения");
        }

        if (!articleData.description) {
            throw new Error("Поле 'description' обязательно для заполнения");
        }

        if (!articleData.content || !Array.isArray(articleData.content)) {
            throw new Error(
                "Поле 'content' обязательно и должно быть массивом"
            );
        }

        const existingDoc = await getDoc(doc(db, "articles", articleData.slug));
        if (existingDoc.exists()) {
            throw new Error(
                `Статья с slug "${articleData.slug}" уже существует`
            );
        }

        const articleToSave = {
            ...articleData,
            datePublishedISO:
                articleData.datePublishedISO || new Date().toISOString(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        delete articleToSave.dateDisplay;

        const docRef = doc(db, "articles", articleData.slug);
        await setDoc(docRef, articleToSave);

        console.log(`✅ Статья "${articleData.title}" успешно создана`);

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

/**
 * Обновляет существующую статью
 * @param {string} slug - Slug статьи
 * @param {Object} updates - Обновляемые поля
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateArticle = async (slug, updates) => {
    try {
        const docRef = doc(db, "articles", slug);
        const existingDoc = await getDoc(docRef);

        if (!existingDoc.exists()) {
            throw new Error(`Статья с slug "${slug}" не найдена`);
        }

        // Удаляем поле dateDisplay из обновлений
        const updatesToSave = { ...updates };
        delete updatesToSave.dateDisplay;

        await setDoc(
            docRef,
            {
                ...updatesToSave,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );

        return { success: true };
    } catch (error) {
        console.error("❌ Ошибка при обновлении статьи:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};

const getArticlesQuery = (category) => {
    if (category) {
        return query(
            collection(db, "articles"),
            where("category", "array-contains", category),
            orderBy("datePublishedISO", "desc")
        );
    }
    return query(
        collection(db, "articles"),
        orderBy("datePublishedISO", "desc")
    );
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

export const prefetchArticle = async (slug, queryClient) => {
    await queryClient.prefetchQuery({
        queryKey: ["articles", slug],
        queryFn: () => fetchArticleBySlug(slug),
        staleTime: 10 * 60 * 1000,
    });
};
