import React from "react";

export const Highlight = ({ title, content }) => (
    <div className="highlight-box">
        {title ? <h3>{title}</h3> : null}
        {content}
    </div>
);
