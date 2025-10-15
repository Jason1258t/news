import { ContentBlock } from "./ContentBloc";


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
