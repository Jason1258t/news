import React from "react";
import { ArticleCard } from "../../shared/ui";
import "./styles.css";

// Static meta extracted from original index.html
const articles = [
    {
        slug: "messenger-gossvat",
        title: "«ГосСват» — новый мессенджер для женщин, ищущих «мальчиков до 18»",
        description:
            "Интеграция с Госуслугами, Озон Банком и домом продажи Стерлигова вызвала общественный резонанс",
        category: "Технологии • Общество",
        date: "5 апреля 2025 г.",
        imageUrl:
            "https://jason1258t.github.io/news/assets/gossvat_preview.png",
    },
];

const Home = () => {
    return (
        <main className="main">
            <div className="container">
                <div className="feed-grid">
                    {articles.map((a) => (
                        <div key={a.slug} className="layout-surface">
                            <ArticleCard
                                to={`/articles/${a.slug}`}
                                title={a.title}
                                excerpt={a.description}
                                date={a.date}
                                category={a.category}
                                imageUrl={a.imageUrl}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Home;
