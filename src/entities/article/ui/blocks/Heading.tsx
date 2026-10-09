import { RenderHtml } from "shared/ui/render-html";
import type { ArticleHeadingBlock } from "../../model/types";

export const Heading = ({ level, text }: Omit<ArticleHeadingBlock, "type">) => {
    const Tag = `h${level}` as const;
    return (
        <Tag>
            <RenderHtml html={text} />
        </Tag>
    );
};
