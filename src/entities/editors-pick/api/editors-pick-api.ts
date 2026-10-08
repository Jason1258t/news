import {
    collection,
    doc,
    getDocs,
    query,
    serverTimestamp,
    writeBatch,
    type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "shared/api";
import type { EditorsPick, EditorsPickBadge, EditorsPickInput } from "../model/types";

const COLLECTION = "editors-pick";

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

/** Все записи подборки. Firestore отдаёт их по ID документа, а ID кодируют позицию. */
export const fetchEditorsPicks = async (): Promise<EditorsPick[]> => {
    try {
        const querySnapshot = await getDocs(query(collection(db, COLLECTION)));
        return querySnapshot.docs.map((snapshot) => mapEditorsPickFromFirestore(snapshot));
    } catch (error) {
        console.error("❌ Ошибка при получении редакционной подборки:", error);
        throw new Error("Не удалось загрузить редакционную подборку", { cause: error });
    }
};

const validatePick = (pick: EditorsPickInput, index: number) => {
    const position = `Запись ${index + 1}`;
    if (!pick.title.trim()) throw new Error(`${position}: поле 'title' обязательно`);
    if (!pick.articleUrl.trim()) throw new Error(`${position}: поле 'articleUrl' обязательно`);
    if (!pick.badge) throw new Error(`${position}: поле 'badge' обязательно`);
};

/**
 * Document IDs sort lexicographically, so `pick_<timestamp>_<position>` keeps the order
 * the editor arranged.
 */
const pickId = (timestamp: number, index: number) =>
    `pick_${timestamp}_${String(index).padStart(3, "0")}`;

/**
 * Заменяет всю подборку одной транзакционной записью: старые записи удаляются, новые
 * создаются в одном batch, поэтому при ошибке подборка остаётся прежней.
 */
export const replaceEditorsPicks = async (picks: EditorsPickInput[]): Promise<void> => {
    picks.forEach(validatePick);

    const current = await getDocs(query(collection(db, COLLECTION)));
    const batch = writeBatch(db);
    current.docs.forEach((snapshot) => batch.delete(snapshot.ref));

    const timestamp = Date.now();
    picks.forEach((pick, index) => {
        batch.set(doc(db, COLLECTION, pickId(timestamp, index)), {
            title: pick.title.trim(),
            description: pick.description?.trim() || "",
            badge: pick.badge,
            articleUrl: pick.articleUrl.trim(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    });

    await batch.commit();
};
