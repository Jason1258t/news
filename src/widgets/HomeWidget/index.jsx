import React from "react";
import styles from "./HomeWidget.module.css";

const HomeWidget = ({ children, title, onClick }) => {
    return (
        <div className={styles.widget} onClick={onClick} style={onClick && {cursor: "pointer"}}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {children}
        </div>
    );
};

export default HomeWidget;
