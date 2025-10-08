import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import logo from '../../logo.jpg';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo">
                        <img src={logo} alt="ПГТУ Breaking NEWS logo"/>
                        <h1>
                            <Link to="/">ПГТУ Breaking NEWS</Link>
                        </h1>
                    </div>

                    <nav className={`nav${isMenuOpen ? " active" : ""}`}>
                        <Link to="/" className="nav-link">
                            Главная
                        </Link>
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
