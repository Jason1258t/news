import type { DailyStats } from "entities/site-stats";
import { formatDate } from "shared/lib/date";
import styles from "./AnalyticsPage.module.css";

const dayLabel = (day: string) => formatDate(`${day}T12:00:00Z`, "short");

interface DailyChartProps {
    days: DailyStats[];
    /** Какой счётчик дня рисовать. */
    value: (day: DailyStats) => number;
    /** Подпись списка столбцов для скринридеров, например «Сеансы по дням». */
    label: string;
}

/** Столбцы счётчика по дням; подписи — у первого, среднего и последнего дня. */
export const DailyChart = ({ days, value, label }: DailyChartProps) => {
    const max = Math.max(1, ...days.map(value));
    // Отрицательный день (сняли больше, чем поставили) — пустой столбец, число видно в подсказке.
    const labelled = new Set([0, Math.floor((days.length - 1) / 2), days.length - 1]);

    return (
        <figure className={styles.chart}>
            <div className={styles.chartScale} aria-hidden="true">
                <span>{max}</span>
                <span>0</span>
            </div>
            <ol className={styles.bars} aria-label={label}>
                {days.map((item, index) => {
                    const count = value(item);
                    const title = `${dayLabel(item.day)}: ${count}`;
                    return (
                        <li key={item.day} className={styles.barSlot} aria-label={title}>
                            <span className={styles.tooltip} aria-hidden="true">
                                {title}
                            </span>
                            <span
                                className={styles.bar}
                                style={{ height: `${(Math.max(0, count) / max) * 100}%` }}
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
