import React from "react";
import { useNavigate } from "react-router-dom";
import EditorsPickWidget from "features/EditorsPickWidget";
import TrendingTopics from "features/TrendingTopics";
import "./styles.css";
import HomeMeta from "./HomeMeta";
import { HomeFeed } from "./HomeFeed";
import HeroWidget from "widgets/Hero";

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <HomeMeta />

            <main className="main">
                <div className="container">
                    <HeroWidget
                        title="ПГТУ Breaking NEWS"
                        subtitle="Самые свежие и актуальные новости из мира
                                технологий, общества и не только. Только
                                проверенная информация и эксклюзивные материалы."
                    />

                    <div className="home-layout">
                        <div className="main-content">
                            <section className="latest-articles">
                                <div className="section-header">
                                    <h2 className="section-title">
                                        Последние публикации
                                    </h2>
                                    <p className="section-subtitle">
                                        Самые свежие материалы нашего издания
                                    </p>
                                </div>

                                <HomeFeed />
                            </section>
                        </div>
                        <aside className="sidebar right-sidebar">
                            <EditorsPickWidget />
                            <TrendingTopics />
                        </aside>
                    </div>

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
