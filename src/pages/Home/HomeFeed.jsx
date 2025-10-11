import ArticleCard from "widgets/ArticleCard";
import { useArticles } from "features/articles/hooks/useArticles";

export const HomeFeed = () => {
    const { data: articles, isLoading, error } = useArticles();

    if (isLoading) {
        return <div className="loading">Загрузка статей...</div>;
    }

    if (error) {
        return <div className="error">Ошибка: {error.message}</div>;
    }

    return (
        <div className="feed-grid">
            {articles.map((article) => (
                <div key={article.slug} className="layout-surface">
                    <ArticleCard
                        to={`/articles/${article.slug}`}
                        title={article.title}
                        excerpt={article.description}
                        date={article.date}
                        category={article.category}
                        imageUrl={article.hero.url}
                    />
                </div>
            ))}
        </div>
    );
};
