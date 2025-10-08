// Home/components/CategoriesSection/index.js
import React from "react";
import "./styles.css";

const CategoriesSection = () => {
    const categories = ["Все статьи", "Технологии", "Общество", "Безопасность", "Исследования"];

    return (
        <section className="categories-section">
            <h2 className="section-title">Рубрики</h2>
            <div className="categories-grid">
                {categories.map((category, index) => (
                    <button 
                        key={index} 
                        className={`category-tag ${index === 0 ? 'active' : ''}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default CategoriesSection;