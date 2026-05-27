import React from "react";
import { Helmet } from "react-helmet-async";
import { PROJECT_NAME } from "app/project";

const AboutPageMeta = () => {
    return (
        <Helmet>
            <title>{`О проекте | ${PROJECT_NAME}`}</title>
            <meta
                name="description"
                content={`${PROJECT_NAME} - независимое студенческое издание. Узнайте о нашей миссии, принципах и команде.`}
            />
            <meta property="og:title" content={`О проекте | ${PROJECT_NAME}`} />
            <meta
                property="og:description"
                content={`${PROJECT_NAME} - независимое студенческое издание. Узнайте о нашей миссии, принципах и команде.`}
            />
            <meta property="og:type" content="website" />
            <meta
                property="og:url"
                content="https://jason1258t.github.io/news/about"
            />
        </Helmet>
    );
};

export default AboutPageMeta;
