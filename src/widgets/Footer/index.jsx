import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Медиапорт Волгатеха</h3>
                        <p>Самые свежие и актуальные новости</p>
                    </div>
                    <div className="footer-section">
                        <h4>Разделы</h4>
                        <a href="#">Главная</a>
                        <a href="#">Политика</a>
                        <a href="#">Экономика</a>
                        <a href="#">Технологии</a>
                    </div>
                    <div className="footer-section">
                        <h4>Контакты</h4>
                        <Link to="/about" className="nav-link">
                            О проекте
                        </Link>
                        <a href="#">Реклама</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 Новостной портал. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
