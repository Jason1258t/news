import type { DocumentSnapshot } from "firebase/firestore";
import { formatDate } from "shared/lib/date";
import { fromFirestoreContent } from "./firestore-content";
import type { Article, ArticleDoc } from "./types";

export const mapArticleFromFirestore = (doc: DocumentSnapshot): Article => {
    const data = (doc.data() ?? {}) as ArticleDoc;
    return {
        slug: doc.id,
        title: data.title || "",
        description: data.description || "",
        category: (Array.isArray(data.category) ? data.category : []).join(" • "),
        dateDisplay: formatDate(data.datePublishedISO),
        datePublishedISO: data.datePublishedISO || new Date().toISOString(),
        author: data.author || "",
        tags: data.tags || [],
        hero: data.hero || { url: "", alt: "" },
        og: data.og || {},
        content: fromFirestoreContent(data.content || []),
    };
};
