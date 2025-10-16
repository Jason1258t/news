import { formatDate } from "shared/lib/date-utils";

export const mapArticleFromFirestore = (doc) => {
    const data = doc.data();
    return {
        slug: doc.id,
        title: data.title || "",
        description: data.description || "",
        category: (Array.isArray(data.category) ? data.category : []).join(
            " • "
        ),
        dateDisplay: formatDate(data.datePublishedISO),
        datePublishedISO: data.datePublishedISO || new Date().toISOString(),
        author: data.author || "",
        tags: data.tags || [],
        hero: data.hero || { url: "", alt: "" },
        og: data.og || {},
        content: data.content || [],
    };
};
