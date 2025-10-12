import React from "react";
import EditorsPickCard from "entities/editors-pick/ui";
import { Link } from "react-router-dom";
import { editorsPicks } from "./picks";
import HomeWidget from "widgets/HomeWidget";

const EditorsPickWidget = () => {
    return (
        <HomeWidget title="👑 Выбор редакции<">
            <div
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
                {editorsPicks.map((pick, index) => (
                    <Link
                        key={index}
                        to={pick.articleUrl}
                        style={{ textDecoration: "none" }}
                    >
                        <EditorsPickCard key={index} pick={pick} />
                    </Link>
                ))}
            </div>
        </HomeWidget>
    );
};

export default EditorsPickWidget;
