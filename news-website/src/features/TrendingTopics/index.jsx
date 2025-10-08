// Home/components/TrendingTopics/index.js
import React from "react";
import "./styles.css";

const TrendingTopics = () => {
    const trendingTopics = [
        { name: "Web3", count: 142 },
        { name: "ИИ безопасность", count: 128 },
        { name: "Квантовые компьютеры", count: 95 },
        { name: "Метавселенная", count: 87 },
        { name: "Киберпсихология", count: 76 }
    ];

    return (
        <div className="widget trending-widget">
            <h3 className="widget-title">🔥 В тренде</h3>
            <div className="trending-topics">
                {trendingTopics.map((topic, index) => (
                    <div key={index} className="topic-item">
                        <span className="topic-name">#{topic.name}</span>
                        <span className="topic-count">{topic.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingTopics;