import React from "react";
import styles from "./SidebarCard.module.css";

export const SidebarCard = ({ children, title, onClick }) => {
    return (
        <div className={styles.widget} onClick={onClick} style={onClick && { cursor: "pointer" }}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {children}
        </div>
    );
};
