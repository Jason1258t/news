import React from "react";
import { RenderHtml } from "shared/ui/render-html";

export const Heading = ({ level, text }) => {
    const Tag = `h${level}`;
    return (
        <Tag>
            <RenderHtml html={text} />
        </Tag>
    );
};
