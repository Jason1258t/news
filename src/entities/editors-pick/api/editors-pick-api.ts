import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    setDoc,
    deleteDoc,
    serverTimestamp,
    type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "shared/api";
import { getErrorMessage } from "shared/lib/error";
import type { EditorsPick, EditorsPickBadge, EditorsPickInput } from "../model/types";

type MutationResult<T = object> = ({ success: true } & T) | { success: false; error: string };

const mapEditorsPickFromFirestore = (snapshot: DocumentSnapshot): EditorsPick => {
    const data = snapshot.data() ?? {};
    return {
        id: snapshot.id,
        title: data.title || "",
        description: data.description || "",
        badge: (data.badge as EditorsPickBadge) || "Must Read",
        articleUrl: data.articleUrl || "",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
};

/** Получает все записи редакционной подборки. */
export const fetchEditorsPicks = async (): Promise<EditorsPick[]> => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "editors-pick")));

        return querySnapshot.docs.map((snapshot) => mapEditorsPickFromFirestore(snapshot));
    } catch (error) {
        console.error("❌ Ошибка при получении редакционной подборки:", error);
        throw new Error("Не удалось загрузить редакционную подборку", { cause: error });
    }
};

/** Создаёт новую запись в редакционной подборке. */
export const createEditorsPick = async (
    pickData: EditorsPickInput,
): Promise<MutationResult<{ id: string }>> => {
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
        const pickId = `pick_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

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
            error: getErrorMessage(error),
        };
    }
};

/** Удаляет запись из редакционной подборки. */
export const deleteEditorsPick = async (id: string): Promise<MutationResult> => {
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
            error: getErrorMessage(error),
        };
    }
};
