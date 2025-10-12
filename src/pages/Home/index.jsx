import React from "react";
import EditorsPickWidget from "features/EditorsPickWidget";
import TrendingTopics from "features/TrendingTopics";
import HomeFeed from "features/HomeFeed";
import HeroWidget from "widgets/Hero";
import CTASetcion from "features/CTA";
import "./styles.css";
import HomeMeta from "./HomeMeta";
import { useSearchParams } from "react-router-dom";

const HomePage = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");

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
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div className="section-header">
                                        <h2 className="section-title">
                                            Последние публикации
                                        </h2>
                                        <p className="section-subtitle">
                                            Самые свежие материалы нашего
                                            издания
                                        </p>
                                    </div>
                                    {category && <h2 style={{margin: 0}}> • {category}</h2>}
                                </div>
                                <HomeFeed />
                            </section>
                        </div>
                        <aside className="sidebar right-sidebar">
                            <EditorsPickWidget />
                            <TrendingTopics />
                        </aside>
                    </div>

                    <CTASetcion />
                </div>
            </main>
        </>
    );
};

export default HomePage;
