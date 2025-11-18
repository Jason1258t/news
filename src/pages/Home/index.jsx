import React from "react";
import EditorsPickWidget from "features/editors-pick/ui";
import HomeFeed from "features/home-feed/HomeFeed";
import FeedHeader from "features/home-feed/FeedHeader";
import CTASetcion from "features/CTA";
import HomeMeta from "./meta";
import ScrollToTopButton from "widgets/buttons/scroll-to-top";
import CurrentHoroscopeWidget from "features/horoscope/ui/CurrentHoroscopeWidget";
import { Main, Container, LayoutWithSidebar } from "shared/ui/layout";

const HomePage = () => {
    return (
        <>
            <HomeMeta />
            <Main>
                <Container>
                    <CTASetcion />
                    <LayoutWithSidebar>
                        <LayoutWithSidebar.MainContent>
                            <FeedHeader />
                            <HomeFeed />
                        </LayoutWithSidebar.MainContent>
                        <LayoutWithSidebar.Sidebar>
                            <EditorsPickWidget />
                            <CurrentHoroscopeWidget />
                        </LayoutWithSidebar.Sidebar>
                    </LayoutWithSidebar>
                </Container>
            </Main>
            <ScrollToTopButton />
        </>
    );
};

export default HomePage;
