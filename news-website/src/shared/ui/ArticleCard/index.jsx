import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const ArticleCard = ({ to, title, excerpt, date, category, imageUrl }) => {
    return (
        <Link to={to} className="article-card">
            {imageUrl ? (
                <div className="article-card-imageWrap">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="article-card-image"
                    />
                </div>
            ) : null}
            <div className="layout-content">
                <div className="article-card-meta">
                    {category ? (
                        <span className="category">{category}</span>
                    ) : null}
                    {date ? <span className="date">{date}</span> : null}
                </div>
                <h3 className="article-card-title">{title}</h3>
                {excerpt ? (
                    <p className="article-card-excerpt">{excerpt}</p>
                ) : null}
            </div>
        </Link>
    );
};

export default ArticleCard;
