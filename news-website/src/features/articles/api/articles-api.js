import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    orderBy,
} from "firebase/firestore";
import { db } from "app/firebase";
import { formatDate } from "shared/lib/date-utils";

const mapArticleFromFirestore = (doc) => {
    const data = doc.data();
    return {
        slug: doc.id,
        title: data.title || "",
        description: data.description || "",
        category: data.category || "",
        dateDisplay: formatDate(data.datePublishedISO),
        datePublishedISO: data.datePublishedISO || new Date().toISOString(),
        author: data.author || "",
        tags: data.tags || [],
        hero: data.hero || { url: "", alt: "" },
        og: data.og || {},
        content: data.content || [],
    };
};

export const fetchArticles = async () => {
    try {
        const articlesQuery = query(
            collection(db, "articles"),
            orderBy("datePublishedISO", "desc")
        );

        const querySnapshot = await getDocs(articlesQuery);

        return querySnapshot.docs.map((doc) => mapArticleFromFirestore(doc));
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw new Error("Failed to fetch articles");
    }
};

export const fetchArticleBySlug = async (slug) => {
    try {
        const docRef = doc(db, "articles", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return mapArticleFromFirestore(docSnap);
        } else {
            throw new Error("Article not found");
        }
    } catch (error) {
        console.error(`Error fetching article ${slug}:`, error);
        throw new Error("Failed to fetch article");
    }
};

export const prefetchArticle = async (slug, queryClient) => {
    await queryClient.prefetchQuery({
        queryKey: ["articles", slug],
        queryFn: () => fetchArticleBySlug(slug),
        staleTime: 10 * 60 * 1000,
    });
};
