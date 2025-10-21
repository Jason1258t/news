import React from "react";
import { Helmet } from "react-helmet-async";

const AboutPageMeta = () => {
    return (
        <Helmet>
            <title>О проекте | ПГТУ Breaking NEWS</title>
            <meta
                name="description"
                content="ПГТУ Breaking NEWS - независимое студенческое издание. Узнайте о нашей миссии, принципах и команде."
            />
            <meta
                property="og:title"
                content="О проекте | ПГТУ Breaking NEWS"
            />
            <meta
                property="og:description"
                content="ПГТУ Breaking NEWS - независимое студенческое издание. Узнайте о нашей миссии, принципах и команде."
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
