import { Link } from "react-router-dom";
import styles from "./NotFoundWidget.module.css";
import { Button } from "shared/ui/button";

export const NotFoundWidget = ({ message = "Страница не найдена" }: { message?: string }) => {
    return (
        <div className={styles.widget}>
            <div className={styles.icon}>🔍</div>
            <h2 className={styles.title}>{message}</h2>
            <p className={styles.description}>
                {message}. Возможно, она была удалена или перемещена.
            </p>
            <div className={styles.actions}>
                <Link to="/" className={styles.homeButton}>
                    На главную
                </Link>
                <Button variant="secondary" onClick={() => window.history.back()}>
                    Назад
                </Button>
            </div>
        </div>
    );
};
