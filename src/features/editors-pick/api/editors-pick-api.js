import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    setDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "app/firebase";

/**
 * @typedef {"Must Read" | "Deep Dive" | "Trending" | "Case Study" | "Tutorial" | "Research"} ArticleBadge
 */

/**
 * @typedef {Object} EditorsPick
 * @property {string} title - Заголовок статьи
 * @property {string} description - Описание статьи
 * @property {ArticleBadge} badge - Метка/категория статьи
 * @property {string} articleUrl - Ссылка на статью
 * @property {string} id - ID документа (автоматически генерируется)
 * @property {Date} createdAt - Дата создания
 * @property {Date} updatedAt - Дата обновления
 */

/**
 * Маппинг данных из Firestore
 * @param {Object} doc - Документ Firestore
 * @returns {EditorsPick}
 */
const mapEditorsPickFromFirestore = (doc) => {
    const data = doc.data();
    return {
        id: doc.id,
        title: data.title || "",
        description: data.description || "",
        badge: data.badge || "Must Read",
        articleUrl: data.articleUrl || "",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
};

/**
 * Получает все записи редакционной подборки
 * @param {Object} options - Опции фильтрации
 * @param {boolean} options.activeOnly - Только активные записи
 * @param {ArticleBadge} options.badge - Фильтр по метке
 * @returns {Promise<EditorsPick[]>}
 */
export const fetchEditorsPicks = async () => {
    try {
        let articlesQuery = collection(db, "editors-pick");
        articlesQuery = query(articlesQuery);
        const querySnapshot = await getDocs(articlesQuery);

        return querySnapshot.docs.map((doc) =>
            mapEditorsPickFromFirestore(doc)
        );
    } catch (error) {
        console.error("❌ Ошибка при получении редакционной подборки:", error);
        throw new Error("Не удалось загрузить редакционную подборку");
    }
};

/**
 * Создает новую запись в редакционной подборке
 * @param {Omit<EditorsPick, 'id' | 'createdAt' | 'updatedAt'>} pickData - Данные для редакционной подборки
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export const createEditorsPick = async (pickData) => {
    try {
        if (!pickData.title?.trim()) {
            throw new Error("Поле 'title' обязательно для заполнения");
        }

        if (!pickData.articleUrl?.trim()) {
            throw new Error("Поле 'articleUrl' обязательно для заполнения");
        }

        if (!pickData.badge) {
            throw new Error("Поле 'badge' обязательно для заполнения");
        }

        // Генерируем ID автоматически
        const pickId = `pick_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;

        const pickToSave = {
            title: pickData.title.trim(),
            description: pickData.description?.trim() || "",
            badge: pickData.badge,
            articleUrl: pickData.articleUrl.trim(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = doc(db, "editors-pick", pickId);
        await setDoc(docRef, pickToSave);

        return {
            success: true,
            id: pickId,
        };
    } catch (error) {
        console.error("❌ Ошибка при создании записи:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Обновляет существующую запись в редакционной подборке
 * @param {string} id - ID записи
 * @param {Partial<Omit<EditorsPick, 'id' | 'createdAt' | 'updatedAt'>>} updates - Обновляемые поля
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateEditorsPick = async (id, updates) => {
    try {
        const docRef = doc(db, "editors-pick", id);
        const existingDoc = await getDoc(docRef);

        if (!existingDoc.exists()) {
            throw new Error(`Запись с ID "${id}" не найдена`);
        }

        const updatesToSave = {
            ...updates,
            updatedAt: serverTimestamp(),
        };

        if (updatesToSave.title)
            updatesToSave.title = updatesToSave.title.trim();
        if (updatesToSave.description)
            updatesToSave.description = updatesToSave.description.trim();
        if (updatesToSave.articleUrl)
            updatesToSave.articleUrl = updatesToSave.articleUrl.trim();

        await setDoc(docRef, updatesToSave, { merge: true });

        return { success: true };
    } catch (error) {
        console.error("❌ Ошибка при обновлении записи:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Удаляет запись из редакционной подборки
 * @param {string} id - ID записи
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteEditorsPick = async (id) => {
    try {
        const docRef = doc(db, "editors-pick", id);
        const existingDoc = await getDoc(docRef);

        if (!existingDoc.exists()) {
            throw new Error(`Запись с ID "${id}" не найдена`);
        }

        await deleteDoc(docRef);

        return { success: true };
    } catch (error) {
        console.error("❌ Ошибка при удалении записи:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Получает конкретную запись по ID
 * @param {string} id - ID записи
 * @returns {Promise<EditorsPick>}
 */
export const fetchEditorsPickById = async (id) => {
    try {
        const docRef = doc(db, "editors-pick", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return mapEditorsPickFromFirestore(docSnap);
        } else {
            throw new Error("Запись не найдена");
        }
    } catch (error) {
        console.error(`❌ Ошибка при получении записи ${id}:`, error);
        throw new Error("Не удалось загрузить запись");
    }
};
