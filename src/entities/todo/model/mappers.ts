import type { DocumentSnapshot } from "firebase/firestore";
import type { Todo } from "./types";

export const fromDoc = (docSnapshot: DocumentSnapshot): Todo => {
    const data = docSnapshot.data() ?? {};

    return {
        id: docSnapshot.id,
        text: data.text,
        completed: data.completed,
        createdAt: data.createdAt?.toDate() || new Date(),
    };
};
