import { RenderHtml } from "shared/ui/render-html";
import type { ArticleBlockquoteBlock } from "../../model/types";
import styles from "./Blocks.module.css";

const VARIANT_CLASS: Record<string, string | undefined> = {
    warning: styles.quoteWarning,
    critical: styles.quoteCritical,
};

export const Blockquote = ({ html, footer, variant }: Omit<ArticleBlockquoteBlock, "type">) => (
    <blockquote
        className={`${styles.quote} ${variant ? (VARIANT_CLASS[variant] ?? "") : ""}`.trim()}
    >
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
