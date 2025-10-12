import React from "react";
import "./styles.css";
import EditorsPickCard from "entities/editors-pick/ui";
import { Link } from "react-router-dom";
import { editorsPicks } from "./picks";

const EditorsPickWidget = () => {
    return (
        <div className="widget editors-pick-widget">
            <h3 className="widget-title">👑 Выбор редакции</h3>
            <div className="editors-picks">
                {editorsPicks.map((pick, index) => (
                    <Link
                        to={pick.articleUrl}
                        style={{ textDecoration: "none" }}
                    >
                        <EditorsPickCard key={index} pick={pick} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default EditorsPickWidget;
