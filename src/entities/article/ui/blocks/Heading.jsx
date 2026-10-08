import React from "react";
import { RenderHTML } from "shared/ui/render-html/RenderHtml";

const Heading = ({ level, text }) => {
    const Tag = `h${level}`;
    return (
        <Tag>
            <RenderHTML html={text} />
        </Tag>
    );
};

export default Heading;
