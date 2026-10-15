import { useState } from "react";
import { useSiteStats } from "entities/site-stats";
import { AdminPage } from "widgets/admin-layout";
import { ErrorWidget } from "shared/ui/error-widget";
import { LoadingSpinner } from "shared/ui/loading-widget";
import styles from "./AnalyticsPage.module.css";
import { TopArticles } from "./TopArticles";
import { VisitsChart } from "./VisitsChart";

const PERIODS = [7, 30, 90] as const;
type Period = (typeof PERIODS)[number];

const formatNumber = (value: number) => value.toLocaleString("ru-RU");

export const AnalyticsPage = () => {
    const [period, setPeriod] = useState<Period>(30);
    const { data: stats, isLoading, error, refetch } = useSiteStats(period);

    const periodSwitch = (
        <div className={styles.periods} role="group" aria-label="Период">
            {PERIODS.map((days) => (
                <button
                    key={days}
                    type="button"
                    className={styles.period}
                    aria-pressed={days === period}
                    onClick={() => setPeriod(days)}
                >
                    {days} дн.
                </button>
            ))}
        </div>
    );

    return (
        <AdminPage
            title="Аналитика"
            description="Сеансы на сайте и просмотры статей. Посещения админов не учитываются."
            actions={periodSwitch}
        >
            {isLoading && <LoadingSpinner />}
            {error && <ErrorWidget message={error.message} onRetry={() => refetch()} />}
            {stats && (
                <div className={styles.layout}>
                    <dl className={styles.tiles}>
                        <div className={styles.tile}>
                            <dt>Сеансы</dt>
                            <dd>{formatNumber(stats.totalVisits)}</dd>
                        </div>
                        <div className={styles.tile}>
                            <dt>Просмотры статей</dt>
                            <dd>{formatNumber(stats.totalArticleViews)}</dd>
                        </div>
                        <div className={styles.tile}>
                            <dt>Сеансов в день</dt>
                            <dd>{formatNumber(Math.round(stats.totalVisits / period))}</dd>
                        </div>
                    </dl>

                    <section className={styles.card} aria-labelledby="visits-title">
                        <h2 id="visits-title" className={styles.cardTitle}>
                            Сеансы по дням
                        </h2>
                        <VisitsChart days={stats.days} />
                    </section>

                    <section className={styles.card} aria-labelledby="top-title">
                        <h2 id="top-title" className={styles.cardTitle}>
                            Популярные статьи
                        </h2>
                        <TopArticles articles={stats.topArticles} />
                    </section>
                </div>
            )}
        </AdminPage>
    );
};
