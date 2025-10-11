// AboutPage.js
import React from "react";
import { Helmet } from "react-helmet-async";

import "./styles.css";

const AboutPage = () => {
    return (
        <>
            <Helmet>
                <title>О проекте | ПГТУ Breaking NEWS</title>
                <meta
                    name="description"
                    content="ПГТУ Breaking NEWS - независимое студенческое издание. Узнайте о нашей миссии, принципах и команде."
                />
                <meta
                    property="og:title"
                    content="О проекте | ПГТУ Breaking NEWS"
                />
                <meta
                    property="og:description"
                    content="ПГТУ Breaking NEWS - независимое студенческое издание. Узнайте о нашей миссии, принципах и команде."
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://jason1258t.github.io/news/about"
                />
            </Helmet>

            <main className="main">
                <div className="container">
                    {/* Герой секция */}
                    <section className="about-hero">
                        <div className="about-hero-content">
                            <h1 className="about-title">О проекте</h1>
                            <p className="about-subtitle">
                                ПГТУ Breaking NEWS — это независимое
                                студенческое издание, созданное для тех, кто
                                хочет знать больше.
                            </p>
                        </div>
                    </section>

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
                                    <li>Только проверенная информация</li>
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

                    {/* Команда */}
                    <section className="about-team">
                        <h2 className="section-title">Команда</h2>
                        <div className="team-grid">
                            <div className="team-member">
                                <div className="member-avatar">👨‍💻</div>
                                <h4>Редакция</h4>
                                <p>
                                    Студенты и выпускники ПГТУ, увлеченные
                                    технологиями, журналистикой и исследованиями
                                </p>
                            </div>

                            <div className="team-member">
                                <div className="member-avatar">🎨</div>
                                <h4>Дизайнеры</h4>
                                <p>
                                    Создают визуальную идентичность и
                                    обеспечивают удобство чтения
                                </p>
                            </div>

                            <div className="team-member">
                                <div className="member-avatar">🔍</div>
                                <h4>Фактчекеры</h4>
                                <p>
                                    Проверяют каждую цифру, цитату и утверждение
                                    перед публикацией
                                </p>
                            </div>
                        </div>
                    </section>

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
                                            "https://t.me/kabanchik207_prime"
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
