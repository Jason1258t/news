import styles from "./FeedSkeleton.module.css";

const SKELETON_CARDS = 3;

/** Placeholder with the card's proportions so the layout does not jump when articles arrive. */
export const FeedSkeleton = () => (
    <div className={styles.grid} role="status" aria-label="Загрузка">
        {Array.from({ length: SKELETON_CARDS }, (_, index) => (
            <div key={index} className={styles.card} aria-hidden="true">
                <div className={styles.image} />
                <div className={styles.body}>
                    <div className={`${styles.line} ${styles.title}`} />
                    <div className={styles.line} />
                    <div className={`${styles.line} ${styles.short}`} />
                </div>
            </div>
        ))}
    </div>
);
