import { useCurrentHoroscope } from "features/horoscope/hooks";
import React from "react";
import { Helmet } from "react-helmet-async";

import styles from "./HoroscopePage.module.css";
import MediaBloc from "widgets/MediaBloc";
import { Main } from "shared/ui/layout/main/Main";
import { Container } from "shared/ui/layout/container/Container";
import { Surface } from "shared/ui/layout/surface/Surface";
import { Content } from "shared/ui/layout/content/Content";
import LoadingWidget from "shared/ui/status/loading";
import ErrorWidget from "shared/ui/status/error";

const HoroscopePage = () => {
    const { data, isLoading, error } = useCurrentHoroscope();

    return (
        <>
            <Helmet>
                <title>ПГТУ Breaking NEWS | Гороскоп</title>
                <meta
                    name="description"
                    content="Самый достоверный гороскоп на неделю"
                />
            </Helmet>
            <Main>
                <Container>
                    <Surface>
                        <Content>
                            {isLoading && <LoadingWidget />}
                            {error && <ErrorWidget message={error?.message} />}
                            <img
                                className={styles.cover}
                                src={data.imageUrl}
                                alt=""
                            />
                            <h1>{data.title}</h1>
                            <div style={{ height: "2rem" }}></div>
                            {data.predictions.map((prediction, idx) => (
                                <MediaBloc
                                    title={prediction.zodiacName}
                                    imageUrl={prediction.imageUrl}
                                    content={prediction.prediction}
                                    align={idx % 2 === 0 ? "left" : "right"}
                                />
                            ))}
                        </Content>
                    </Surface>
                </Container>
            </Main>
        </>
    );
};

export default HoroscopePage;
