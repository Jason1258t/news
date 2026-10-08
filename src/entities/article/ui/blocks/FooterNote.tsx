import { RenderHtml } from "shared/ui/render-html";
import type { ArticleFooterNoteBlock } from "../../model/types";
import styles from "./Blocks.module.css";

export const FooterNote = ({ html }: Omit<ArticleFooterNoteBlock, "type">) => (
    <div className={styles.footerNote}>
        <p>
            <RenderHtml html={html} />
        </p>
    </div>
);
