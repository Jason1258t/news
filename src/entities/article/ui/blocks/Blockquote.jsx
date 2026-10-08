import React from "react";
import { RenderHTML } from "shared/ui/render-html/RenderHtml";

const Blockquote = ({ html, footer, variant }) => (
    <blockquote className={`quote${variant && variant !== "default" ? ` ${variant}` : ""}`}>
        <p>
            <RenderHTML html={html} />
        </p>
        {footer ? (
            <footer>
                <RenderHTML html={footer} />
            </footer>
        ) : null}
    </blockquote>
);

export default Blockquote;
