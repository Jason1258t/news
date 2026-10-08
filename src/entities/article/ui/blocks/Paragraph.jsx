import React from "react";
import { RenderHTML } from "shared/ui/render-html/RenderHtml";

const Paragraph = ({ html }) => (
    <p>
        <RenderHTML html={html} />
    </p>
);

export default Paragraph;
