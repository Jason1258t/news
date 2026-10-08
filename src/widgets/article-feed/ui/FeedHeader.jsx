import React from "react";
import styles from "./FeedHeader.module.css";
import { TagsPanel } from "features/filter-by-tags";
import { useSearchParams } from "react-router-dom";

export const FeedHeader = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");

    return (
        <div className={styles.header}>
            {category && <h2 className={styles.categoryName}>{category}</h2>}
            <TagsPanel />
        </div>
    );
};
