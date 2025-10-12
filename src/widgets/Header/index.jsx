import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import logo from "logo.jpg";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo">
                        <img src={logo} alt="ПГТУ Breaking NEWS logo" />
                        <h1>
                            <Link to="/">ПГТУ Breaking NEWS</Link>
                        </h1>
                    </div>

                    <nav className={`nav${isMenuOpen ? " active" : ""}`}>
                        <Link to="/" className="nav-link">
                            Главная
                        </Link>
                        <Link to="/?category=Наука" className="nav-link">
                            Наука
                        </Link>
                        <Link to="/?category=Общество" className="nav-link">
                            Общество
                        </Link>
                        <Link to="/?category=Технологии" className="nav-link">
                            Технологии
                        </Link>
                        <Link to="/?category=Спорт" className="nav-link">
                            Спорт
                        </Link>
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
