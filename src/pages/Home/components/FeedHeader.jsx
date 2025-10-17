import React from "react";
import styles from "./FeedHeder.module.css";

const FeedHeader = ({ category }) => {
    return (
        <div className={styles.header}>
            {category && <h2 className={styles.categoryName}>{category}</h2>}
        </div>
    );
};

export default FeedHeader;
