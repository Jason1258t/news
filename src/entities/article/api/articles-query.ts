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

/**
 * Firestore allows only one array-contains / array-contains-any filter per query.
 * With both a category and tags, tags are filtered by Firestore and the category
 * on the client (see needsClientCategoryFilter).
 */
export const needsClientCategoryFilter = (category?: string | null, tags?: string[]) =>
    Boolean(category && tags && tags.length > 0);

export const getArticlesQuery = (
    category?: string | null,
    tags?: string[],
    itemsPerPage = 5,
    lastDoc: DocumentSnapshot | null = null,
) => {
    const baseQuery = collection(db, "articles");

    const constraints: QueryConstraint[] = [orderBy("datePublishedISO", "desc")];

    if (category && !needsClientCategoryFilter(category, tags)) {
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
