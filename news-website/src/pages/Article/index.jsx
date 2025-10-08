import React from "react";
import { useParams } from 'react-router-dom';
import { articlesStorage } from "features/articles_storage";
import ArticleRenderer from "features/article_render";

const Article = () => {
    const { slug } = useParams();
    const article = articlesStorage[slug];

    if (!article) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>Статья не найдена</h1>
                <p>Статья с идентификатором "{slug}" не существует.</p>
            </div>
        );
    }

    return <ArticleRenderer article={article} />;
};

export default Article;
