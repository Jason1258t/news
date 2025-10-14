import React from "react";
import EditorsPickWidget from "features/editors-pick/ui";
import HomeFeed from "features/HomeFeed";
import CTASetcion from "features/CTA";
import HeroWidget from "widgets/Hero";
import "./styles.css";
import HomeMeta from "./HomeMeta";
import { useSearchParams } from "react-router-dom";
import FeedHeader from "./components/FeedHeader";
import YandexAd from "features/AD";

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
                            <FeedHeader category={category} />
                            <HomeFeed />
                        </div>
                        <aside className="sidebar">
                            <EditorsPickWidget />
                        </aside>
                    </div>

                    <CTASetcion />
                </div>
            </main>
        </>
    );
};

export default HomePage;
