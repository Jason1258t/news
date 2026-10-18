import { TRAFFIC_SOURCE_LABELS, type SourceShare } from "entities/site-stats";
import styles from "./AnalyticsPage.module.css";

interface SourceListProps {
    sources: SourceShare[];
    /** Подпись списка для скринридеров. */
    label: string;
}

/** Источники по убыванию: название, число и доля от общего. */
export const SourceList = ({ sources, label }: SourceListProps) => {
    const total = sources.reduce((sum, item) => sum + item.count, 0);
    if (total === 0) {
        return <p className={styles.muted}>Пока нет данных.</p>;
    }

    return (
        <ul className={styles.sources} aria-label={label}>
            {sources.map(({ source, count }) => {
                const share = Math.round((count / total) * 100);
                return (
                    <li key={source ?? "unknown"} className={styles.source}>
                        <span className={source ? undefined : styles.muted}>
                            {source ? TRAFFIC_SOURCE_LABELS[source] : "Не определён"}
                        </span>
                        <span className={styles.sourceCount}>
                            {count.toLocaleString("ru-RU")}{" "}
                            <span className={styles.muted}>· {share}%</span>
                        </span>
                        <span className={styles.sourceBar} aria-hidden="true">
                            <span
                                className={styles.share}
                                style={{ width: `${(count / total) * 100}%` }}
                            />
                        </span>
                    </li>
                );
            })}
        </ul>
    );
};
