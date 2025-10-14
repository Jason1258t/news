import React from "react";
import styles from "./LoadingWidget.module.css";

const LoadingWidget = ({ message = "Загрузка..." }) => {
    return (
        <div className={styles.widget}>
            <div className={styles.icon}>
                <div className={styles.spinner}></div>
            </div>
            <h2 className={styles.title}>{message}</h2>
            <p className={styles.description}>Пожалуйста, подождите немного</p>
            <div className={styles.dots}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
            </div>
        </div>
    );
};

export const LoadingSpinner = () => {
    return <div style={{display: "flex", justifyContent: "center"}}>
        <div className={styles.spinner}></div>
    </div>;
};

export default LoadingWidget;
