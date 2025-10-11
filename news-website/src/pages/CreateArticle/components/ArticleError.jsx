import React from "react";
import { Link } from "react-router-dom";
import "./ArticleError.css";

const ArticleError = ({ error }) => {
    return (
        <main className="main">
            <div className="container">
                <div className="article-error">
                    <div className="error-icon">❌</div>
                    <h2>Не удалось загрузить статью</h2>
                    <p>{error}</p>
                    <Link to="/" className="btn btn-primary">
                        Вернуться на главную
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ArticleError;