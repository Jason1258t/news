import React from "react";
import { RenderHTML } from "../../../shared/lib/html";

const Heading = ({ level, text }) => {
    const Tag = `h${level}`;
    return (
        <Tag>
            <RenderHTML html={text} />
        </Tag>
    );
};

const Paragraph = ({ html }) => (
    <p>
        <RenderHTML html={html} />
    </p>
);

const List = ({ items }) => (
    <ul>
        {items.map((it, idx) => (
            <li key={idx}>
                <RenderHTML html={it} />
            </li>
        ))}
    </ul>
);

const ImageBlock = ({ url, alt, caption }) => (
    <div className="article-image">
        <img src={url} alt={alt} />
        {caption ? <span className="image-caption">{caption}</span> : null}
    </div>
);

const Blockquote = ({ html, footer, variant }) => (
    <blockquote
        className={`quote${
            variant && variant !== "default" ? ` ${variant}` : ""
        }`}
    >
        <p>
            <RenderHTML html={html} />
        </p>
        {footer ? (
            <footer>
                <RenderHTML html={footer} />
            </footer>
        ) : null}
    </blockquote>
);

const Highlight = ({ title, content }) => (
    <div className="highlight-box">
        {title ? <h3>{title}</h3> : null}
        {content?.map((block, i) => (
            <ContentBlock key={i} block={block} />
        ))}
    </div>
);

const FooterNote = ({ html }) => (
    <div className="article-footer">
        <p>
            <RenderHTML html={html} />
        </p>
    </div>
);

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
    const { title, description, category, dateDisplay, hero, content, tags } =
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
                                    <img src={hero.url} alt={hero.alt} />
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
