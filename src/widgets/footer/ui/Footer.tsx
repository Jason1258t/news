import { Link } from "react-router-dom";
import { ARTICLE_CATEGORIES, TELEGRAM_CHANNEL_URL } from "shared/config";
import { Container } from "shared/ui/layout";
import styles from "./Footer.module.css";
import telegram from "./telegram.webp";

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.content}>
                    <div className={styles.section}>
                        <h3>Медиапорт Волгатеха</h3>
                        <p>Самые свежие и актуальные новости</p>
                        <div className={styles.social}>
                            <Link
                                to={TELEGRAM_CHANNEL_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Telegram-канал"
                            >
                                <img className={styles.socialIcon} alt="" src={telegram} />
                            </Link>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <h4>Разделы</h4>
                        <Link to="/">Главная</Link>
                        {ARTICLE_CATEGORIES.map((category) => (
                            <Link key={category} to={`/?category=${category}`}>
                                {category}
                            </Link>
                        ))}
                    </div>
                    <div className={styles.section}>
                        <h4>Контакты</h4>
                        <Link to="/about">О проекте</Link>
                        <Link
                            to="https://dalink.to/vtech_news"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Поддержать проект
                        </Link>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <p>&copy; 2025 Новостной портал. Ваши права не защищены.</p>
                </div>
            </Container>
        </footer>
    );
};
