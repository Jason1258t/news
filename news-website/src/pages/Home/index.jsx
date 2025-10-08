import React from "react";
import { ArticleCard } from "shared/ui";
import { articlesStorage } from "features/articles_storage";
import "./styles.css";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const articles = Object.entries(articlesStorage).map(([slug, article]) => ({
        slug: slug,
        title: article.title,
        description: article.description,
        category: article.category,
        date: article.dateDisplay,
        imageUrl: article.hero.url,
    }));

    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>
                    ПГТУ Breaking NEWS - Самые свежие и актуальные новости
                </title>
                <meta
                    name="description"
                    content="Эксклюзивные материалы о технологиях, обществе и исследованиях. Только проверенная информация и глубокий анализ событий."
                />
                <meta
                    name="keywords"
                    content="новости, технологии, общество, исследования, ПГТУ, аналитика"
                />
                <meta name="author" content="ПГТУ Breaking NEWS" />

                <meta
                    property="og:title"
                    content="ПГТУ Breaking NEWS - Самые свежие и актуальные новости"
                />
                <meta
                    property="og:description"
                    content="Эксклюзивные материалы о технологиях, обществе и исследованиях. Только проверенная информация и глубокий анализ событий."
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://jason1258t.github.io/news"
                />
                <meta
                    property="og:image"
                    content="https://i.ibb.co/rfF9d2CD/Screenshot-2025-10-08-at-14-59-13.png"
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="ПГТУ Breaking NEWS" />
                <meta property="og:locale" content="ru_RU" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="ПГТУ Breaking NEWS - Самые свежие и актуальные новости"
                />
                <meta
                    name="twitter:description"
                    content="Эксклюзивные материалы о технологиях, обществе и исследованиях. Только проверенная информация и глубокий анализ событий."
                />
                <meta
                    name="twitter:image"
                    content="https://i.ibb.co/rfF9d2CD/Screenshot-2025-10-08-at-14-59-13.png"
                />

                {/* Canonical */}
                <link
                    rel="canonical"
                    href="https://jason1258t.github.io/news"
                />
            </Helmet>

            <main className="main">
                <div className="container">
                    {/* Заголовок и описание сайта */}
                    <section className="hero-section">
                        <div className="hero-content">
                            <h1 className="hero-title">ПГТУ Breaking NEWS</h1>
                            <p className="hero-subtitle">
                                Самые свежие и актуальные новости из мира
                                технологий, общества и не только. Только
                                проверенная информация и эксклюзивные материалы.
                            </p>
                        </div>
                    </section>

                    {/* Категории/фильтры */}
                    <section className="categories-section">
                        <h2 className="section-title">Рубрики</h2>
                        <div className="categories-grid">
                            <button className="category-tag active">
                                Все статьи
                            </button>
                            <button className="category-tag">Технологии</button>
                            <button className="category-tag">Общество</button>
                            <button className="category-tag">
                                Безопасность
                            </button>
                            <button className="category-tag">
                                Исследования
                            </button>
                        </div>
                    </section>

                    {/* Последние статьи */}
                    <section className="latest-articles">
                        <div className="section-header">
                            <h2 className="section-title">
                                Последние публикации
                            </h2>
                            <p className="section-subtitle">
                                Самые свежие материалы нашего издания
                            </p>
                        </div>

                        <div className="feed-grid">
                            {articles.map((article) => (
                                <div
                                    key={article.slug}
                                    className="layout-surface"
                                >
                                    <ArticleCard
                                        to={`/articles/${article.slug}`}
                                        title={article.title}
                                        excerpt={article.description}
                                        date={article.date}
                                        category={article.category}
                                        imageUrl={article.imageUrl}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="cta-section">
                        <div className="cta-content">
                            <h3>Оставайтесь в курсе событий</h3>
                            <p>
                                Подпишитесь на наши обновления, чтобы первыми
                                получать самые важные и интересные новости
                            </p>
                            <div className="cta-buttons">
                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        window.open(
                                            "https://t.me/SSalVamvRotSuki"
                                        )
                                    }
                                >
                                    Подписаться
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => navigate("/about")}
                                >
                                    О проекте
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
};

export default Home;
