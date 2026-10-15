import type { DailyStats } from "entities/site-stats";
import { formatDate } from "shared/lib/date";
import styles from "./AnalyticsPage.module.css";

const dayLabel = (day: string) => formatDate(`${day}T12:00:00Z`, "short");

/** Столбцы сеансов по дням; подписи — у первого, среднего и последнего дня. */
export const VisitsChart = ({ days }: { days: DailyStats[] }) => {
    const max = Math.max(1, ...days.map((item) => item.visits));
    const labelled = new Set([0, Math.floor((days.length - 1) / 2), days.length - 1]);

    return (
        <figure className={styles.chart}>
            <div className={styles.chartScale} aria-hidden="true">
                <span>{max}</span>
                <span>0</span>
            </div>
            <ol className={styles.bars} aria-label="Сеансы по дням">
                {days.map((item, index) => {
                    const label = `${dayLabel(item.day)}: ${item.visits}`;
                    return (
                        <li key={item.day} className={styles.barSlot} aria-label={label}>
                            <span className={styles.tooltip} aria-hidden="true">
                                {label}
                            </span>
                            <span
                                className={styles.bar}
                                style={{ height: `${(item.visits / max) * 100}%` }}
                            />
                            {labelled.has(index) && (
                                <span className={styles.barLabel} aria-hidden="true">
                                    {dayLabel(item.day).replace(/ \d{4}$/, "")}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </figure>
    );
};
