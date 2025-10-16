
export const validateArticleData = (articleData) => {
    if (!articleData.slug) {
        throw new Error("Поле 'slug' обязательно для заполнения");
    }

    if (!articleData.title) {
        throw new Error("Поле 'title' обязательно для заполнения");
    }

    if (!articleData.description) {
        throw new Error("Поле 'description' обязательно для заполнения");
    }

    if (!articleData.content || !Array.isArray(articleData.content)) {
        throw new Error("Поле 'content' обязательно и должно быть массивом");
    }
};