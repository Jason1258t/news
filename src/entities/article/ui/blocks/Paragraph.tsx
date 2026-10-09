import { RenderHtml } from "shared/ui/render-html";
import type { ArticleParagraphBlock } from "../../model/types";

export const Paragraph = ({ html }: Omit<ArticleParagraphBlock, "type">) => (
    <p>
        <RenderHtml html={html} />
    </p>
);
