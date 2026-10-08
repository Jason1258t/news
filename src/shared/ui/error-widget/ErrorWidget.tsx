import { FilledButton } from "shared/ui/button";
import styles from "./ErrorWidget.module.css";

interface ErrorWidgetProps {
    message?: string;
    onRetry?: () => void;
}

export const ErrorWidget = ({ message = "Произошла ошибка", onRetry }: ErrorWidgetProps) => {
    return (
        <div className={styles.widget}>
            <div className={styles.icon}>⚠️</div>
            <h2 className={styles.title}>Упс! Что-то пошло не так</h2>
            <p className={styles.description}>{message}</p>
            {onRetry && <FilledButton onClick={onRetry}>Попробовать снова</FilledButton>}
        </div>
    );
};
