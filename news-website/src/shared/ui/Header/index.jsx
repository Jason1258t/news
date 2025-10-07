import React, { useState } from "react";
import "./styles.css";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo">
                        <h1>ПГТУ Breaking NEWS</h1>
                    </div>

                    <nav className={`nav${isMenuOpen ? " active" : ""}`}>
                        <a href="#" className="nav-link">
                            Главная
                        </a>
                        <a href="#" className="nav-link">
                            Политика
                        </a>
                        <a href="#" className="nav-link">
                            Экономика
                        </a>
                        <a href="#" className="nav-link">
                            Технологии
                        </a>
                        <a href="#" className="nav-link">
                            Спорт
                        </a>
                    </nav>

                    <div
                        className={`burger-menu${isMenuOpen ? " active" : ""}`}
                        onClick={toggleMenu}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
