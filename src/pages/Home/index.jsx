import React from "react";
import EditorsPickWidget from "features/editors-pick/ui";
import HomeFeed from "features/HomeFeed";
import CTASetcion from "features/CTA";
import "./styles.css";
import HomeMeta from "./meta";
import FeedHeader from "./components/FeedHeader";
import ScrollToTopButton from "widgets/buttons/scroll-to-top";

const HomePage = () => {
    return (
        <>
            <HomeMeta />
            <main className="main">
                <div className="container">
                    <CTASetcion />
                    <div className="home-layout">
                        <div className="main-content">
                            <FeedHeader />
                            <HomeFeed />
                        </div>
                        <aside className="sidebar">
                            <EditorsPickWidget />
                        </aside>
                    </div>
                </div>
            </main>
            <ScrollToTopButton />
        </>
    );
};

export default HomePage;
