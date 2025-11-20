import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import logo from "logo.jpg";
import { Container } from "shared/ui/layout";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const navigate = useNavigate();

  return (
    <header className="header">
      <Container>
        <div className="header-content">
          <div className="logo" onClick={() => navigate("/")}>
            <img src={logo} alt="ПГТУ Breaking NEWS logo" />
            <h1>ПГТУ Breaking NEWS</h1>
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
