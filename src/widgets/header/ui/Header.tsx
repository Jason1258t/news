import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "entities/session";
import { ARTICLE_CATEGORIES, PROJECT_NAME } from "shared/config";
import { Container } from "shared/ui/layout";
import "./Header.css";
import logo from "./logo.jpg";

export const Header = () => {
    const { user } = useSession();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);
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
                        <Link to="/" className="nav-link" onClick={closeMenu}>
                            Главная
                        </Link>
                        {ARTICLE_CATEGORIES.map((category) => (
                            <Link
                                key={category}
                                to={`/?category=${category}`}
                                className="nav-link"
                                onClick={closeMenu}
                            >
                                {category}
                            </Link>
                        ))}
                    </nav>
                    {user ? (
                        <Link to="/admin" className="admin-button" onClick={closeMenu}>
                            Админка
                        </Link>
                    ) : (
                        <Link to="/login" className="admin-button" onClick={closeMenu}>
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
