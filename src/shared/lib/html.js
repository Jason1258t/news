import React from "react";

export const RenderHTML = ({ html }) => (
    <span dangerouslySetInnerHTML={{ __html: html }} />
);
