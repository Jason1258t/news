import React, { useState } from "react";
import { useAuth } from "features/auth/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import logo from "logo.jpg";
import { PROJECT_NAME } from "app/project";
import { Container } from "shared/ui/layout";

const Header = () => {
    const { user, loading } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const navigate = useNavigate();

    return (
        <header className="header">
            <Container>
                <div className="header-content">
                    <div className="logo" onClick={() => navigate("/")}>
                        <img src={logo} alt={`${PROJECT_NAME} logo`} />
                        <h1>{PROJECT_NAME}</h1>
                    </div>

                    <nav className={`nav${isMenuOpen ? " active" : ""}`}>
                        <Link
                            to="/"
                            className="nav-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Главная
                        </Link>
                        <Link
                            to="/?category=Наука"
                            className="nav-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Наука
                        </Link>
                        <Link
                            to="/?category=Общество"
                            className="nav-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Общество
                        </Link>
                        <Link
                            to="/?category=Технологии"
                            className="nav-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Технологии
                        </Link>
                        <Link
                            to="/?category=Спорт"
                            className="nav-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Спорт
                        </Link>
                        <Link
                            to="/horoscope"
                            className="nav-link menu-only-mobile"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Гороскоп
                        </Link>
                    </nav>
                    {user ? (
                        <Link
                            to="/admin"
                            className="admin-button"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Админка
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="admin-button"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Войти
                        </Link>
                    )}

                    <div
                        className={`burger-menu${isMenuOpen ? " active" : ""}`}
                        onClick={toggleMenu}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default Header;
