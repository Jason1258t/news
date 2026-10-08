import {
    collection,
    limit,
    orderBy,
    query,
    startAfter,
    where,
    type DocumentSnapshot,
    type QueryConstraint,
} from "firebase/firestore";
import { db } from "shared/api";

export const getArticlesQuery = (
    category?: string | null,
    tags?: string[],
    itemsPerPage = 5,
    lastDoc: DocumentSnapshot | null = null,
) => {
    const baseQuery = collection(db, "articles");

    const constraints: QueryConstraint[] = [orderBy("datePublishedISO", "desc")];

    if (category) {
        constraints.push(where("category", "array-contains", category));
    }

    if (tags && tags.length > 0) {
        constraints.push(where("tags", "array-contains-any", tags));
    }

    if (lastDoc) {
        constraints.push(startAfter(lastDoc));
    }

    constraints.push(limit(itemsPerPage));

    return query(baseQuery, ...constraints);
};
