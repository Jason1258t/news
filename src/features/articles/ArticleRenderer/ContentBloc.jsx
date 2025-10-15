import {
    Heading,
    Paragraph,
    List,
    ImageBlock,
    Blockquote,
    Highlight,
    FooterNote,
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
            default:
                return null;
        }
    } catch (e) {
        console.log(e);
        console.log(`block, caused error: ${block}`);
    }
};
