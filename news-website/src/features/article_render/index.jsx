import {
    Heading,
    Paragraph,
    List,
    ImageBlock,
    Blockquote,
    Highlight,
    FooterNote,
} from "entities/article/ui";

const ContentBlock = ({ block }) => {
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
            return <Highlight title={block.title} content={block.content} />;
        case "footer-note":
            return <FooterNote html={block.html} />;
        default:
            return null;
    }
};

const ArticleRenderer = ({ article }) => {
    const { title, description, category, dateDisplay, hero, content, tags, og } =
        article;

    return (
        <main className="main">
            <div className="container">
                <div className="layout-surface">
                    <div className="layout-content">
                        <article className="news-article">
                            <div className="article-header">
                                <div className="article-meta">
                                    <span className="category">{category}</span>
                                    <span className="date">{dateDisplay}</span>
                                </div>
                                <h1 className="article-title">{title}</h1>
                                {description ? (
                                    <div className="article-excerpt">
                                        <p>{description}</p>
                                    </div>
                                ) : null}
                            </div>

                            {hero ? (
                                <div className="article-image">
                                    <img src={og.image} alt={hero.alt} />
                                    {hero.caption ? (
                                        <span className="image-caption">
                                            {hero.caption}
                                        </span>
                                    ) : null}
                                </div>
                            ) : null}

                            <div className="article-content">
                                {content?.map((block, idx) => (
                                    <ContentBlock key={idx} block={block} />
                                ))}

                                {Array.isArray(tags) && tags.length ? (
                                    <div className="article-tags">
                                        {tags.map((t, i) => (
                                            <span key={i} className="tag">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ArticleRenderer;
