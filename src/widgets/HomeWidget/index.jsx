import React from "react";
import styles from "./HomeWidget.module.css";

const HomeWidget = ({ children, title }) => {
    return (
        <div className={styles.widget}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {children}
        </div>
    );
};

export default HomeWidget;
