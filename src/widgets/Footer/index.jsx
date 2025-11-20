import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import telegram from "./telegram.svg.webp";
import { Container } from "shared/ui/layout";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <div className="footer-content">
          <div className="footer-section">
            <h3>Медиапорт Волгатеха</h3>
            <p>Самые свежие и актуальные новости</p>
            <div style={{ display: "flex", marginTop: "1rem" }}>
              <Link
                to="https://t.me/pgtu_breaking_news"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className="footer-social-icon" alt="" src={telegram} />
              </Link>
            </div>
          </div>
          <div className="footer-section">
            <h4>Разделы</h4>
            <Link to="/">Главная</Link>
            <Link to="/?category=Наука">Наука</Link>
            <Link to="/?category=Общество">Общество</Link>
            <Link to="/?category=Технологии">Технологии</Link>
            <Link to="/?category=Спорт">Спорт</Link>
          </div>
          <div className="footer-section">
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
        <div className="footer-bottom">
          <p>&copy; 2025 Новостной портал. Ваши права не защищены.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
