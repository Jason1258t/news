import React from "react";
import EditorsPickCard from "entities/editors-pick/ui";
import { Link } from "react-router-dom";
import HomeWidget from "widgets/HomeWidget";
import { useEditorsPicks } from "../hooks/useEditorsPicks";
import { LoadingSpinner } from "shared/ui/status/loading";

const EditorsPickWidget = () => {
    const { loading, editorsPicks } = useEditorsPicks();

    return (
        <HomeWidget title="👑 Выбор редакции">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    editorsPicks.map((pick, index) => (
                        <Link
                            key={index}
                            to={pick.articleUrl}
                            style={{ textDecoration: "none" }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <EditorsPickCard key={index} pick={pick} />
                        </Link>
                    ))
                )}
            </div>
        </HomeWidget>
    );
};

export default EditorsPickWidget;
