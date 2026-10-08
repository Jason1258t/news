import { RenderHtml } from "shared/ui/render-html";
import type { ArticleFooterNoteBlock } from "../../model/types";

export const FooterNote = ({ html }: Omit<ArticleFooterNoteBlock, "type">) => (
    <div className="article-footer">
        <p>
            <RenderHtml html={html} />
        </p>
    </div>
);
