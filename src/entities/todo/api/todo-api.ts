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
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            text,
            completed: false,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding todo:", error);
        throw error;
    }
};

export const toggleTodo = async (id: string, completed: boolean) => {
    try {
        await updateDoc(doc(db, COLLECTION_NAME, id), {
            completed: !completed,
        });
    } catch (error) {
        console.error("Error toggling todo:", error);
        throw error;
    }
};

export const deleteTodo = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting todo:", error);
        throw error;
    }
};

export const updateTodo = async (id: string, text: string) => {
    try {
        await updateDoc(doc(db, COLLECTION_NAME, id), {
            text,
        });
    } catch (error) {
        console.error("Error updating todo:", error);
        throw error;
    }
};
