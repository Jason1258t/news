import { RenderHtml } from "shared/ui/render-html";
import type { ArticleListBlock } from "../../model/types";

export const List = ({ items }: Omit<ArticleListBlock, "type">) => (
    <ul>
        {items.map((item, idx) => (
            <li key={idx}>
                <RenderHtml html={item} />
            </li>
        ))}
    </ul>
);
