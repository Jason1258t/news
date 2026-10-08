import { RenderHtml } from "shared/ui/render-html";
import type { ArticleBlockquoteBlock } from "../../model/types";

export const Blockquote = ({ html, footer, variant }: Omit<ArticleBlockquoteBlock, "type">) => (
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
