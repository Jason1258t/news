import React from "react";
import EditorsPickWidget from "features/editors-pick/ui";
import HomeFeed from "features/HomeFeed";
import CTASetcion from "features/CTA";
import "./styles.css";
import HomeMeta from "./meta";
import FeedHeader from "./components/FeedHeader";
import ScrollToTopButton from "widgets/buttons/scroll-to-top";
import CurrentHoroscopeWidget from "features/horoscope/ui/CurrentHoroscopeWidget";
import { Main, Container } from "shared/ui/layout";

const HomePage = () => {
    return (
        <>
            <HomeMeta />
            <Main>
                <Container>
                    <CTASetcion />
                    <div className="home-layout">
                        <div className="main-content">
                            <FeedHeader />
                            <HomeFeed />
                        </div>
                        <aside className="sidebar">
                            <EditorsPickWidget />
                            <CurrentHoroscopeWidget />
                        </aside>
                    </div>
                </Container>
            </Main>
            <ScrollToTopButton />
        </>
    );
};

export default HomePage;
