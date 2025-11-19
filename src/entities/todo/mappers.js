import { Timestamp } from "firebase/firestore";

export const fromDoc = (docSnapshot) => {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    text: data.text,
    completed: data.completed,
    createdAt: data.createdAt?.toDate() || new Date(),
  };
};

export const toDoc = (todo) => ({
  text: todo.text,
  completed: todo.completed,
  ...(todo.createdAt && {
    createdAt: Timestamp.fromDate(todo.createdAt),
  }),
});
