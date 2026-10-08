import React from "react";
import { RenderHtml } from "shared/ui/render-html";

export const Blockquote = ({ html, footer, variant }) => (
    <blockquote className={`quote${variant && variant !== "default" ? ` ${variant}` : ""}`}>
        <p>
            <RenderHtml html={html} />
        </p>
        {footer ? (
            <footer>
                <RenderHtml html={footer} />
            </footer>
        ) : null}
    </blockquote>
);
