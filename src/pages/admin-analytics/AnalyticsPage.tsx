import { useMemo, useState } from "react";
import { useAllLikeCounts } from "entities/article-like";
import { useSiteStats } from "entities/site-stats";
import { AdminPage } from "widgets/admin-layout";
import { ErrorWidget } from "shared/ui/error-widget";
import { LoadingSpinner } from "shared/ui/loading-widget";
import styles from "./AnalyticsPage.module.css";
import { TopArticles } from "./TopArticles";
import { TopLiked } from "./TopLiked";
import { DailyChart } from "./DailyChart";

const PERIODS = [7, 30, 90] as const;
type Period = (typeof PERIODS)[number];

const formatNumber = (value: number) => value.toLocaleString("ru-RU");

export const AnalyticsPage = () => {
    const [period, setPeriod] = useState<Period>(30);
    const { data: stats, isLoading, error, refetch } = useSiteStats(period);
    // Лайки хранятся без дат, поэтому они за всё время и от периода не зависят.
    const { data: likes, isError: likesFailed } = useAllLikeCounts();
    const likesBySlug = useMemo(
        () => (likes ? new Map(likes.map(({ slug, likes: count }) => [slug, count])) : undefined),
        [likes],
    );
    const totalLikes = likes?.reduce((sum, item) => sum + item.likes, 0);

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
            description="Сеансы, просмотры и прирост лайков — за выбранный период; итоги по лайкам — за всё время. Посещения админов не учитываются."
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
                        <div className={styles.tile}>
                            <dt>Лайки за всё время</dt>
                            <dd>{totalLikes === undefined ? "—" : formatNumber(totalLikes)}</dd>
                        </div>
                    </dl>

                    <section className={styles.card} aria-labelledby="visits-title">
                        <h2 id="visits-title" className={styles.cardTitle}>
                            Сеансы по дням
                        </h2>
                        <DailyChart
                            days={stats.days}
                            value={(day) => day.visits}
                            label="Сеансы по дням"
                        />
                    </section>

                    <section className={styles.card} aria-labelledby="likes-title">
                        <h2 id="likes-title" className={styles.cardTitle}>
                            Прирост лайков по дням{" "}
                            <span className={styles.cardNote}>
                                за период: {formatNumber(stats.totalNewLikes)}
                            </span>
                        </h2>
                        <DailyChart
                            days={stats.days}
                            value={(day) => day.likes}
                            label="Прирост лайков по дням"
                        />
                    </section>

                    <section className={styles.card} aria-labelledby="top-title">
                        <h2 id="top-title" className={styles.cardTitle}>
                            Популярные статьи
                        </h2>
                        <TopArticles articles={stats.topArticles} likes={likesBySlug} />
                    </section>

                    <section className={styles.card} aria-labelledby="liked-title">
                        <h2 id="liked-title" className={styles.cardTitle}>
                            Больше всего лайков{" "}
                            <span className={styles.cardNote}>за всё время</span>
                        </h2>
                        {likes ? (
                            <TopLiked articles={likes} />
                        ) : likesFailed ? (
                            <p className={styles.muted}>Не удалось загрузить лайки.</p>
                        ) : (
                            <LoadingSpinner />
                        )}
                    </section>
                </div>
            )}
        </AdminPage>
    );
};
