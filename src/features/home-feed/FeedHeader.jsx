import React from "react";
import styles from "./FeedHeder.module.css";
import TagsPannel from "features/tags/ui/TagsPannel";
import { useSearchParams } from "react-router-dom";

const FeedHeader = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");

    return (
        <div className={styles.header}>
            {category && <h2 className={styles.categoryName}>{category}</h2>}
            <TagsPannel />
        </div>
    );
};

export default FeedHeader;
