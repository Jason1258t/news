import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp,
    type FirestoreError,
} from "firebase/firestore";
import { db } from "shared/api";
import { fromDoc } from "../model/mappers";
import type { Todo } from "../model/types";

const COLLECTION_NAME = "todos";

export const onChange = (
    onData: (todos: Todo[]) => void,
    onError: (error: FirestoreError) => void,
) => {
    return onSnapshot(
        collection(db, COLLECTION_NAME),
        (snapshot) => {
            const todosData = snapshot.docs.map(fromDoc);
            onData(todosData);
        },
        onError,
    );
};

export const addTodo = async (text: string) => {
    await addDoc(collection(db, COLLECTION_NAME), {
        text,
        completed: false,
        createdAt: serverTimestamp(),
    });
};

export const toggleTodo = async (id: string, completed: boolean) => {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
        completed: !completed,
    });
};

export const deleteTodo = async (id: string) => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
};

export const updateTodo = async (id: string, text: string) => {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
        text,
    });
};
