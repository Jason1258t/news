import styles from "./LoadingWidget.module.css";

export const LoadingWidget = ({ message = "Загрузка..." }: { message?: string }) => {
    return (
        <div className={styles.widget}>
            <div className={styles.icon}>
                <div className={styles.spinner}></div>
            </div>
            <h2 className={styles.title}>{message}</h2>
            <p className={styles.description}>Пожалуйста, подождите немного</p>
            <div className={styles.dots}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
            </div>
        </div>
    );
};

export const LoadingSpinner = () => {
    return (
        <div
            role="status"
            aria-label="Загрузка"
            style={{ display: "flex", justifyContent: "center" }}
        >
            <div className={styles.spinner}></div>
        </div>
    );
};
