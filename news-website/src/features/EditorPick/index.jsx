// Home/components/EditorsPick/index.js
import React from "react";
import "./styles.css";

const EditorsPick = () => {
    const editorsPicks = [
        {
            title: "Как нейросети видят наши данные",
            description: "Визуализация работы GPT-4 через призму психологии восприятия",
            badge: "Must Read"
        },
        {
            title: "Код будущего: от TypeScript к AI-ассистентам",
            description: "Как изменится работа разработчика через 5 лет",
            badge: "Deep Dive"
        }
    ];

    return (
        <div className="widget editors-pick-widget">
            <h3 className="widget-title">👑 Выбор редакции</h3>
            <div className="editors-picks">
                {editorsPicks.map((pick, index) => (
                    <div key={index} className="pick-item">
                        <div className="pick-badge">{pick.badge}</div>
                        <h4 className="pick-title">{pick.title}</h4>
                        <p className="pick-description">{pick.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditorsPick;