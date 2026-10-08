import { PROJECT_NAME } from "shared/config";

import { Button } from "shared/ui/button";
import { Hero } from "shared/ui/hero";
import { AboutMeta } from "./AboutMeta";
import styles from "./AboutPage.module.css";
import { TeamSection } from "./TeamSection";
import { Main, Container } from "shared/ui/layout";

export const AboutPage = () => {
    return (
        <>
            <AboutMeta />

            <Main>
                <Container>
                    <Hero
                        title="О проекте"
                        subtitle={`${PROJECT_NAME} — это независимое студенческое издание, созданное для тех, кто хочет знать больше.`}
                    />

                    {/* Миссия и ценности */}
                    <section className={styles.mission}>
                        <div className={styles.missionGrid}>
                            <div className={styles.missionCard}>
                                <div className={styles.missionIcon}>🎯</div>
                                <h3>Наша миссия</h3>
                                <p>
                                    Создавать качественный контент, который расширяет горизонты,
                                    бросает вызов стереотипам и помогает разобраться в сложных
                                    технологических и социальных явлениях.
                                </p>
                            </div>

                            <div className={styles.missionCard}>
                                <div className={styles.missionIcon}>⚡</div>
                                <h3>Наши принципы</h3>
                                <ul>
                                    <li>Глубокий анализ вместо поверхностных заголовков</li>
                                    <li>Независимость от политических и коммерческих интересов</li>
                                    <li>Доступность сложных тем для широкой аудитории</li>
                                </ul>
                            </div>

                            <div className={styles.missionCard}>
                                <div className={styles.missionIcon}>🚀</div>
                                <h3>Наше видение</h3>
                                <p>
                                    Стать платформой, где студенты и молодые специалисты могут
                                    делиться экспертизой, развивать медиа-навыки и влиять на
                                    общественный дискурс.
                                </p>
                            </div>
                        </div>
                    </section>

                    <TeamSection />

                    {/* Контакты */}
                    <section className={styles.contact}>
                        <h2>Свяжитесь с нами</h2>
                        <div className={styles.contactContent}>
                            <p>
                                Есть идеи для статей? Хотите присоединиться к команде? Нашли ошибку
                                в материале?
                            </p>
                            <div className={styles.contactActions}>
                                <Button
                                    onClick={() =>
                                        window.open("https://t.me/pgtu_breaking_news?direct")
                                    }
                                >
                                    Написать редакции
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => window.open("https://t.me/+L7dQmwJ8nSBjMmIy")}
                                >
                                    Предложить тему
                                </Button>
                            </div>
                        </div>
                    </section>

                    <section className={styles.disclaimer}>
                        <div className={styles.disclaimerContent}>
                            <div className={styles.disclaimerIcon}>⚠️</div>
                            <div className={styles.disclaimerText}>
                                <h3>Важная информация</h3>
                                <p>
                                    <strong>
                                        Большая часть контента на этом сайте является художественным
                                        вымыслом и сатирой.
                                    </strong>
                                    Наши материалы созданы в образовательных и развлекательных
                                    целях, чтобы развивать навыки написания статей и работы с
                                    современными веб-технологиями.
                                </p>
                                <p className={styles.disclaimerNote}>
                                    Все совпадения с реальными событиями и лицами случайны.
                                </p>
                            </div>
                        </div>
                    </section>
                </Container>
            </Main>
        </>
    );
};
