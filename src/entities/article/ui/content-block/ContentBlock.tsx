import { lazy, Suspense } from "react";
import {
    Blockquote,
    FooterNote,
    Heading,
    Highlight,
    ImageBlock,
    List,
    Paragraph,
    Table,
} from "../blocks";
import type { ArticleContentBlock } from "../../model/types";

// KaTeX and Prism are only needed by articles with formulas or code, so they load on demand.
const Formula = lazy(() => import("../blocks/Formula").then((m) => ({ default: m.Formula })));
const CodeBlock = lazy(() => import("../blocks/CodeBlock").then((m) => ({ default: m.CodeBlock })));

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
            return (
                <Suspense fallback={<code>{block.formula}</code>}>
                    <Formula formula={block.formula} display={block.display} />
                </Suspense>
            );
        case "code":
            return (
                <Suspense
                    fallback={
                        <pre>
                            <code>{block.code}</code>
                        </pre>
                    }
                >
                    <CodeBlock
                        code={block.code}
                        language={block.language}
                        filename={block.filename}
                    />
                </Suspense>
            );
        case "table":
            return <Table data={block.data} hasHeader={block.hasHeader} />;
        default:
            console.warn(`Unknown block type: ${(block as { type: string }).type}`);
            return null;
    }
};
