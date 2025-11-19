import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "app/firebase";
import { fromDoc } from "entities/todo/mappers";

const COLLECTION_NAME = "todos";

export const onChange = (onData, onError) => {
  return onSnapshot(
    collection(db, COLLECTION_NAME),
    (snapshot) => {
      const todosData = snapshot.docs.map(fromDoc);
      onData(todosData);
    },
    onError
  );
};

export const addTodo = async (text) => {
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

export const toggleTodo = async (id, completed) => {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      completed: !completed,
    });
  } catch (error) {
    console.error("Error toggling todo:", error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};

export const updateTodo = async (id, text) => {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      text,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};
