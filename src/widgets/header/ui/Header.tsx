import { useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "entities/session";
import { ARTICLE_CATEGORIES, PROJECT_NAME } from "shared/config";
import { Container } from "shared/ui/layout";
import styles from "./Header.module.css";
import logo from "./logo.jpg";

export const Header = () => {
    const { user } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className={styles.header}>
            <Container>
                <div className={styles.content}>
                    <Link to="/" className={styles.logo} onClick={closeMenu}>
                        <img src={logo} alt={`${PROJECT_NAME} logo`} />
                        <h1>{PROJECT_NAME}</h1>
                    </Link>

                    <div className={styles.actions}>
                        <nav
                            id="main-nav"
                            className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}
                        >
                            <Link to="/" className={styles.navLink} onClick={closeMenu}>
                                Главная
                            </Link>
                            {ARTICLE_CATEGORIES.map((category) => (
                                <Link
                                    key={category}
                                    to={`/?category=${category}`}
                                    className={styles.navLink}
                                    onClick={closeMenu}
                                >
                                    {category}
                                </Link>
                            ))}
                        </nav>
                        <Link
                            to={user ? "/admin" : "/login"}
                            className={styles.adminButton}
                            onClick={closeMenu}
                        >
                            {user ? "Админка" : "Войти"}
                        </Link>
                    </div>

                    <button
                        type="button"
                        className={`${styles.burger} ${isMenuOpen ? styles.burgerOpen : ""}`}
                        aria-label="Меню"
                        aria-controls="main-nav"
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen((open) => !open)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </Container>
        </header>
    );
};
