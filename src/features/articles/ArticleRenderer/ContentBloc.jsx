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
} from "entities/article/ui";

export const ContentBlock = ({ block }) => {
    try {
        switch (block.type) {
            case "heading":
                return <Heading level={block.level} text={block.text} />;
            case "paragraph":
                return <Paragraph html={block.html} />;
            case "list":
                return <List items={block.items} />;
            case "image":
                return (
                    <ImageBlock
                        url={block.url}
                        alt={block.alt}
                        caption={block.caption}
                    />
                );
            case "blockquote":
                return (
                    <Blockquote
                        html={block.html}
                        footer={block.footer}
                        variant={block.variant}
                    />
                );
            case "highlight":
                return (
                    <Highlight
                        title={block.title}
                        content={block.content.map((e, idx) =>  <ContentBlock key={idx} block={e}/>)}
                    />
                );
            case "footer-note":
                return <FooterNote html={block.html} />;
            case "formula":
                return (
                    <Formula
                        formula={block.formula}
                        display={block.display}
                    />
                );
            case "code":
                return (
                    <CodeBlock
                        code={block.code}
                        language={block.language}
                        filename={block.filename}
                    />
                );
            case "table":
                return (
                    <Table
                        data={block.data}
                        hasHeader={block.hasHeader}
                    />
                );
            default:
                console.warn(`Unknown block type: ${block.type}`);
                return null;
        }
    } catch (e) {
        console.error("Error rendering block:", e);
        return null;
    }
};