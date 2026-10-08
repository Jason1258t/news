import React from "react";
import { RenderHTML } from "shared/ui/render-html/RenderHtml";

const FooterNote = ({ html }) => (
    <div className="article-footer">
        <p>
            <RenderHTML html={html} />
        </p>
    </div>
);

export default FooterNote;
