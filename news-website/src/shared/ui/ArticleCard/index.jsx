import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const ArticleCard = ({ to, title, excerpt, date, category, imageUrl }) => {
    return (
        <article className="article-card">
            {imageUrl ? (
                <Link to={to} className="article-card-imageWrap">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="article-card-image"
                    />
                </Link>
            ) : null}
            <div className="article-card-body">
                <div className="article-card-meta">
                    {category ? (
                        <span className="category">{category}</span>
                    ) : null}
                    {date ? <span className="date">{date}</span> : null}
                </div>
                <h3 className="article-card-title">
                    <Link to={to}>{title}</Link>
                </h3>
                {excerpt ? (
                    <p className="article-card-excerpt">{excerpt}</p>
                ) : null}
                <div className="article-card-actions">
                    <Link to={to} className="nav-button">
                        Читать
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default ArticleCard;
