// Home/components/StatsWidget/index.js
import React from "react";
import "./styles.css";

const StatsWidget = () => {
    const stats = [
        { label: "Читателей в месяц", value: "15K+" },
        { label: "Уникального контента", value: "94%" },
        { label: "Время реакции", value: "48ч" }
    ];

    return (
        <div className="widget stats-widget">
            <h3 className="widget-title">📊 Статистика</h3>
            <div className="stats-list">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                        <span className="stat-label">{stat.label}</span>
                        <span className="stat-value">{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsWidget;