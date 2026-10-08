import React from "react";
import { RenderHTML } from "shared/ui/render-html/RenderHtml";

const List = ({ items }) => (
    <ul>
        {items.map((it, idx) => (
            <li key={idx}>
                <RenderHTML html={it} />
            </li>
        ))}
    </ul>
);

export default List;
