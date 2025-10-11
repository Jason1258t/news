import React from "react";
import "./ArticleLoading.css";

const ArticleLoading = () => {
    return (
        <main className="main">
            <div className="container">
                <div className="article-loading">
                    <div className="loading-spinner"></div>
                    <p>Загружаем статью...</p>
                </div>
            </div>
        </main>
    );
};

export default ArticleLoading;