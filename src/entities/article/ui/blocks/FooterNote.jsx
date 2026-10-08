import React from "react";
import { RenderHtml } from "shared/ui/render-html";

export const FooterNote = ({ html }) => (
    <div className="article-footer">
        <p>
            <RenderHtml html={html} />
        </p>
    </div>
);
