import {
    collection,
    query,
    orderBy,
    where,
    limit,
    startAfter,
} from "firebase/firestore";
import { db } from "app/firebase";

export const getArticlesQuery = (category, itemsPerPage = 5, lastDoc = null) => {
    let baseQuery = collection(db, "articles");

    const constraints = [orderBy("datePublishedISO", "desc")];

    if (category) {
        constraints.push(where("category", "array-contains", category));
    }

    if (lastDoc) {
        constraints.push(startAfter(lastDoc));
    }

    constraints.push(limit(itemsPerPage));

    return query(baseQuery, ...constraints);
};
