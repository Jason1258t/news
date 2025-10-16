import { collection, query, orderBy, where } from "firebase/firestore";
import { db } from "app/firebase";

export const getArticlesQuery = (category) => {
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
