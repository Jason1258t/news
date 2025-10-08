import React from "react";
import { useParams } from "react-router-dom";
import { articlesStorage } from "features/articles_storage";
import ArticleRenderer from "features/article_render";
import { Helmet } from "react-helmet-async";
// import { useMetaTags } from "features/use_article_meta";

const Article = () => {
    const { slug } = useParams();
    const article = articlesStorage[slug];
   
    // useMetaTags(article);
    if (!article) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>Статья не найдена</h1>
                <p>Статья с идентификатором "{slug}" не существует.</p>
            </div>
        );
    }

    const fullUrl = `https://jason1258t.github.io/news/#/articles/${article.slug}`;
    const imageUrl = article.hero.url; // Уже полный URL из данных статьи

    return (
        <>
            {" "}
            <Helmet>
                {/* Основные мета-теги */}
                <title>{`${article.title} | ПГТУ Breaking NEWS`}</title>
                <meta name="description" content={article.description} />
                <meta name="keywords" content={article.tags.join(", ")} />
                <meta name="author" content={article.author} />

                {/* Open Graph */}
                <meta
                    property="og:title"
                    content={article.og?.title || article.title}
                />
                <meta
                    property="og:description"
                    content={article.og?.description || article.description}
                />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={article.og?.url || fullUrl} />
                <meta
                    property="og:image"
                    content={article.og?.image || imageUrl}
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="ПГТУ Breaking NEWS" />
                <meta property="og:locale" content="ru_RU" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content={article.og?.title || article.title}
                />
                <meta
                    name="twitter:description"
                    content={article.og?.description || article.description}
                />
                <meta
                    name="twitter:image"
                    content={article.og?.image || imageUrl}
                />

                {/* Article-specific OG tags */}
                <meta
                    property="article:published_time"
                    content={article.datePublishedISO}
                />
                <meta property="article:author" content={article.author} />
                <meta property="article:section" content={article.section} />
                {article.tags.map((tag) => (
                    <meta key={tag} property="article:tag" content={tag} />
                ))}

                {/* Canonical URL */}
                <link rel="canonical" href={article.og?.url || fullUrl} />
            </Helmet>
            <ArticleRenderer article={article} />
        </>
    );
};

export default Article;
