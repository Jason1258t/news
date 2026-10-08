import React from "react";
import { RenderHtml } from "shared/ui/render-html";

export const List = ({ items }) => (
    <ul>
        {items.map((it, idx) => (
            <li key={idx}>
                <RenderHtml html={it} />
            </li>
        ))}
    </ul>
);
