import React, { useState } from "react";
import ArticlesList from "./components/ArticlesList";
import CurrentPicks from "./components/CurrentPicks";
import BadgesOverlay from "./components/BagesOverlay";

const EditorsPickPanel = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="main">
                <div
                    style={{ display: "flex", gap: "3rem" }}
                    className="container"
                >
                    <ArticlesList />
                    <CurrentPicks changeBadge={() => setIsOpen(true)} />
                </div>
            </div>
            <BadgesOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default EditorsPickPanel;
