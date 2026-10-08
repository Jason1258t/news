import React from "react";
import EditorsPickWidget from "widgets/editors-pick-sidebar/ui/EditorsPickSidebar";
import HomeFeed from "widgets/article-feed/ui/ArticleFeed";
import FeedHeader from "widgets/article-feed/ui/FeedHeader";
import CTASetcion from "widgets/subscribe-cta/ui/SubscribeCta";
import HomeMeta from "./HomeMeta";
import ScrollToTopButton from "shared/ui/scroll-to-top-button/ScrollToTopButton";
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
                        </LayoutWithSidebar.Sidebar>
                    </LayoutWithSidebar>
                </Container>
            </Main>
            <ScrollToTopButton />
        </>
    );
};

export default HomePage;
