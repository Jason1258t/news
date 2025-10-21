import React from "react";

import "./styles.css";
import HeroWidget from "widgets/Hero";
import AboutPageMeta from "./meta";
import TeamSectionCompact from "./sections/TeamSection";

const AboutPage = () => {
    return (
        <>
            <AboutPageMeta />

            <main className="main">
                <div className="container">
                    <HeroWidget
                        title="О проекте"
                        subtitle=" ПГТУ Breaking NEWS — это независимое
                                студенческое издание, созданное для тех, кто
                                хочет знать больше."
                    />

                    {/* Миссия и ценности */}
                    <section className="about-mission">
                        <div className="mission-grid">
                            <div className="mission-card">
                                <div className="mission-icon">🎯</div>
                                <h3>Наша миссия</h3>
                                <p>
                                    Создавать качественный контент, который
                                    расширяет горизонты, бросает вызов
                                    стереотипам и помогает разобраться в сложных
                                    технологических и социальных явлениях.
                                </p>
                            </div>

                            <div className="mission-card">
                                <div className="mission-icon">⚡</div>
                                <h3>Наши принципы</h3>
                                <ul>
                                    <li>
                                        Глубокий анализ вместо поверхностных
                                        заголовков
                                    </li>
                                    <li>
                                        Независимость от политических и
                                        коммерческих интересов
                                    </li>
                                    <li>
                                        Доступность сложных тем для широкой
                                        аудитории
                                    </li>
                                </ul>
                            </div>

                            <div className="mission-card">
                                <div className="mission-icon">🚀</div>
                                <h3>Наше видение</h3>
                                <p>
                                    Стать платформой, где студенты и молодые
                                    специалисты могут делиться экспертизой,
                                    развивать медиа-навыки и влиять на
                                    общественный дискурс.
                                </p>
                            </div>
                        </div>
                    </section>

                    <TeamSectionCompact />

                    {/* Контакты */}
                    <section className="about-contact">
                        <h2 className="section-title">Свяжитесь с нами</h2>
                        <div className="contact-content">
                            <p>
                                Есть идеи для статей? Хотите присоединиться к
                                команде? Нашли ошибку в материале?
                            </p>
                            <div className="contact-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        window.open(
                                            "https://t.me/kabanchik207_prime"
                                        )
                                    }
                                >
                                    Написать редакции
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        window.open(
                                            "https://t.me/+L7dQmwJ8nSBjMmIy"
                                        )
                                    }
                                >
                                    Предложить тему
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="disclaimer-section">
                        <div className="disclaimer-content">
                            <div className="disclaimer-icon">⚠️</div>
                            <div className="disclaimer-text">
                                <h3>Важная информация</h3>
                                <p>
                                    <strong>
                                        Большая часть контента на этом сайте
                                        является художественным вымыслом и
                                        сатирой.
                                    </strong>
                                    Наши материалы созданы в образовательных и
                                    развлекательных целях, чтобы развивать
                                    навыки написания статей и работы с
                                    современными веб-технологиями.
                                </p>
                                <p className="disclaimer-note">
                                    Все совпадения с реальными событиями и
                                    лицами случайны.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
};

export default AboutPage;
