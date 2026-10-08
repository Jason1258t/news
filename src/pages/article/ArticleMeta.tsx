import { Helmet } from "react-helmet-async";
import { getArticlePreview, type Article } from "entities/article";
import { PROJECT_NAME } from "shared/config";

export const ArticleMeta = ({ article }: { article: Article }) => {
    const preview = getArticlePreview(article);

    return (
        <Helmet>
            {/* Основные мета-теги */}
            <title>{`${article.title} | ${PROJECT_NAME}`}</title>
            <meta name="description" content={article.description} />
            <meta name="keywords" content={article.tags.join(", ")} />
            <meta name="author" content={article.author} />

            {/* Open Graph */}
            <meta property="og:title" content={preview.title} />
            <meta property="og:description" content={preview.description} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={preview.url} />
            <meta property="og:image" content={preview.image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content={PROJECT_NAME} />
            <meta property="og:locale" content="ru_RU" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={preview.title} />
            <meta name="twitter:description" content={preview.description} />
            <meta name="twitter:image" content={preview.image} />

            {/* Article-specific OG tags */}
            <meta property="article:published_time" content={article.datePublishedISO} />
            <meta property="article:author" content={article.author} />
            <meta property="article:section" content={article.category} />
            {article.tags.map((tag) => (
                <meta key={tag} property="article:tag" content={tag} />
            ))}

            {/* Canonical URL */}
            <link rel="canonical" href={preview.url} />
        </Helmet>
    );
};
