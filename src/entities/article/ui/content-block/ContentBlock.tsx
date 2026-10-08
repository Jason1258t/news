import {
    Heading,
    Paragraph,
    List,
    ImageBlock,
    Blockquote,
    Highlight,
    FooterNote,
    Formula,
    CodeBlock,
    Table,
} from "../blocks";
import type { ArticleContentBlock } from "../../model/types";

export const ContentBlock = ({ block }: { block: ArticleContentBlock }) => {
    switch (block.type) {
        case "heading":
            return <Heading level={block.level} text={block.text} />;
        case "paragraph":
            return <Paragraph html={block.html} />;
        case "list":
            return <List items={block.items} />;
        case "image":
            return <ImageBlock url={block.url} alt={block.alt} caption={block.caption} />;
        case "blockquote":
            return <Blockquote html={block.html} footer={block.footer} variant={block.variant} />;
        case "highlight":
            return (
                <Highlight
                    title={block.title}
                    // Old documents may lack `content`, despite the type.
                    content={(block.content ?? []).map((e, idx) => (
                        <ContentBlock key={idx} block={e} />
                    ))}
                />
            );
        case "footer-note":
            return <FooterNote html={block.html} />;
        case "formula":
            return <Formula formula={block.formula} display={block.display} />;
        case "code":
            return (
                <CodeBlock code={block.code} language={block.language} filename={block.filename} />
            );
        case "table":
            return <Table data={block.data} hasHeader={block.hasHeader} />;
        default:
            console.warn(`Unknown block type: ${(block as { type: string }).type}`);
            return null;
    }
};
