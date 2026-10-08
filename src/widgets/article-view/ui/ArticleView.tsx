import { Link } from "react-router-dom";
import { ContentBlock, ImageBlock, type Article } from "entities/article";
import styles from "./ArticleView.module.css";

export const ArticleView = ({ article }: { article: Article }) => {
    const { title, description, category, dateDisplay, hero, content, tags } = article;

    return (
        <article className={styles.article}>
            <div className={styles.header}>
                <div className={styles.meta}>
                    <span className={styles.category}>{category}</span>
                    <span>{dateDisplay}</span>
                </div>
                <h1 className={styles.title}>{title}</h1>
                {description ? (
                    <div className={styles.excerpt}>
                        <p>{description}</p>
                    </div>
                ) : null}
            </div>

            {hero.url ? <ImageBlock url={hero.url} alt={hero.alt} caption={hero.caption} /> : null}

            <div className={styles.content}>
                {content.map((block, idx) => (
                    <ContentBlock key={idx} block={block} />
                ))}

                {tags.length > 0 ? (
                    <div className={styles.tags}>
                        {tags.map((tag) => (
                            <Link
                                key={tag}
                                to={`/?tags=${encodeURIComponent(tag)}`}
                                className={styles.tag}
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                ) : null}
            </div>
        </article>
    );
};
