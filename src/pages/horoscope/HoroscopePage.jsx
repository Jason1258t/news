import React from "react";
import { Helmet } from "react-helmet-async";

import styles from "./HoroscopePage.module.css";
import MediaBloc from "widgets/MediaBloc";
import { Content } from "shared/ui/layout/content/Content";
import LoadingWidget from "shared/ui/status/loading";
import ErrorWidget from "shared/ui/status/error";

import { useParams } from "react-router-dom";
import { useCurrentHoroscope } from "features/horoscope/hooks";
import { useHoroscopeById } from "features/horoscope/hooks";
import { SurfacePage } from "shared/ui/layout";

const Page = ({ children }) => {
    return (
        <SurfacePage spacing="compact">
            <Content className={styles.content}>{children}</Content>
        </SurfacePage>
    );
};

const HoroscopePage = () => {
    const { id } = useParams();

    const currentHoroscopeQuery = useCurrentHoroscope();
    const horoscopeByIdQuery = useHoroscopeById(id);

    const { data, isLoading, error } = id
        ? horoscopeByIdQuery
        : currentHoroscopeQuery;

    return (
        <>
            <Helmet>
                <title>ПГТУ Breaking NEWS | Гороскоп</title>
                <meta
                    name="description"
                    content="Самый достоверный гороскоп на неделю"
                />
            </Helmet>
            <Page>
                {isLoading && <LoadingWidget />}
                {error && <ErrorWidget message={error?.message} />}
                {data && (
                    <>
                        <div className={styles.header}>
                            <h1 className={styles.title}>{data.title}</h1>
                        </div>
                        <img
                            className={styles.cover}
                            src={data.imageUrl}
                            alt=""
                        />
                        <p className={styles.description}>{data.description}</p>
                        <div style={{ height: "2rem" }}></div>
                        <div className={styles.predictions}>
                            {data.predictions.map((prediction, idx) => (
                                <MediaBloc
                                    title={prediction.zodiacName}
                                    imageUrl={prediction.imageUrl}
                                    content={prediction.prediction}
                                    align={idx % 2 === 0 ? "left" : "right"}
                                    key={idx}
                                />
                            ))}{" "}
                        </div>
                    </>
                )}
            </Page>
        </>
    );
};

export default HoroscopePage;
