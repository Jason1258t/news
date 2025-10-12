import React from "react";
import "./styles.css";
import HomeWidget from "widgets/HomeWidget";

const TrendingTopics = () => {
    const trendingTopics = [
        { name: "Web3", count: 142 },
        { name: "ИИ безопасность", count: 128 },
        { name: "Квантовые компьютеры", count: 95 },
        { name: "Метавселенная", count: 87 },
        { name: "Киберпсихология", count: 76 }
    ];

    return (
        <HomeWidget title="🔥 В тренде">
            <div className="trending-topics">
                {trendingTopics.map((topic, index) => (
                    <div key={index} className="topic-item">
                        <span className="topic-name">#{topic.name}</span>
                        <span className="topic-count">{topic.count}</span>
                    </div>
                ))}
            </div>
        </HomeWidget>
    );
};

export default TrendingTopics;