import React from "react";
import { RenderHtml } from "shared/ui/render-html";

export const Paragraph = ({ html }) => (
    <p>
        <RenderHtml html={html} />
    </p>
);
