/** Проверяет обязательные поля статьи перед сохранением. Бросает Error с текстом для пользователя. */
export const validateArticleData = (articleData: Record<string, unknown>): void => {
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
