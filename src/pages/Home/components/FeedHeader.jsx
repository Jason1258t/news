import React from "react";
import styles from "./FeedHeder.module.css";

const FeedHeader = ({ category }) => {
    return (
        <div className={styles.header}>
            <div>
                <h2 className={styles.title}>Последние публикации</h2>
                <p className={styles.subtitle}>
                    Самые свежие материалы нашего издания
                </p>
            </div>
            {category && (
                <h2 className={styles.categoryName}>
                    <span> • </span>
                    {category}
                </h2>
            )}
        </div>
    );
};

export default FeedHeader;
