import styles from "./ArticleCardSmall.module.css";

interface ArticleCardSmallProps {
    title: string;
    excerpt?: string;
    date?: string;
    imageUrl?: string;
    onClick?: () => void;
    highlight?: boolean;
}

export const ArticleCardSmall = ({
    title,
    excerpt,
    date,
    imageUrl,
    onClick,
    highlight = false,
}: ArticleCardSmallProps) => {
    return (
        <div onClick={onClick} className={`${styles.card} ${highlight ? styles.highlight : ""}`}>
            {imageUrl && <img src={imageUrl} alt={title} className={styles.image} />}
            <div className={styles.content}>
                {date && <span className={styles.date}>{date}</span>}
                <h3 className={styles.title}>{title}</h3>
                {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
            </div>
        </div>
    );
};
