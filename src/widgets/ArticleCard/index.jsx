import React from "react";
import { Link } from "react-router-dom";
import styles from "./ArticleCard.module.css";

const ArticleCard = ({ to, title, excerpt, date, category, imageUrl }) => {
    return (
        <Link to={to} className={styles.card}>
            {imageUrl ? (
                <div className={styles.imageWrap}>
                    <img src={imageUrl} alt={title} className={styles.image} />
                </div>
            ) : null}
            <div className={styles.content}>
                <div className={styles.meta}>
                    {category ? (
                        <span className={styles.category}>{category}</span>
                    ) : null}
                    {date ? <span className={styles.date}>{date}</span> : null}
                </div>
                <h3 className={styles.title}>{title}</h3>
                {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
            </div>
        </Link>
    );
};

export default ArticleCard;
