import React from "react";
import HomeWidget from "widgets/HomeWidget";
import { useCurrentHoroscope } from "../hooks";
import { LoadingSpinner } from "shared/ui/status/loading";
import ErrorWidget from "shared/ui/status/error";
import { useNavigate } from "react-router-dom";

import styles from './CurrentHoroscopeWidget.module.css';

const CurrentHoroscopeWidget = () => {
    const { data, isLoading, error } = useCurrentHoroscope();
    const navigate = useNavigate();
    return (
        <HomeWidget
            title="Гороскоп на неделю"
            onClick={() => {
                if (data) navigate("/horoscope");
            }}
        >
            {isLoading && <LoadingSpinner />}
            {error && <ErrorWidget message={error?.message} />}
            {data && (
                <>
                    <img alt="" src={data.imageUrl} className={styles.cover}/>
                    <p className={styles.description}>{data.title}</p>
                </>
            )}

            {((!data && !isLoading) || (data && data.id === undefined)) && (
                <p className={styles.notFound}>К сожалению гороскоп на сегодня не найден</p>
            )}
        </HomeWidget>
    );
};

export default CurrentHoroscopeWidget;
