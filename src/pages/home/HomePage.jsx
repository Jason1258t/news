import React from "react";
import { EditorsPickSidebar } from "widgets/editors-pick-sidebar";
import { ArticleFeed, FeedHeader } from "widgets/article-feed";
import { SubscribeCta } from "widgets/subscribe-cta";
import { HomeMeta } from "./HomeMeta";
import { ScrollToTopButton } from "shared/ui/scroll-to-top-button";
import { Main, Container, LayoutWithSidebar } from "shared/ui/layout";

export const HomePage = () => {
    return (
        <>
            <HomeMeta />
            <Main>
                <Container>
                    <SubscribeCta />
                    <LayoutWithSidebar>
                        <LayoutWithSidebar.MainContent>
                            <FeedHeader />
                            <ArticleFeed />
                        </LayoutWithSidebar.MainContent>
                        <LayoutWithSidebar.Sidebar>
                            <EditorsPickSidebar />
                        </LayoutWithSidebar.Sidebar>
                    </LayoutWithSidebar>
                </Container>
            </Main>
            <ScrollToTopButton />
        </>
    );
};
