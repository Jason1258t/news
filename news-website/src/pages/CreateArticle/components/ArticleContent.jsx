// features/article/components/ArticleContent.js
import React from "react";
import "./ArticleContent.css";

const ArticleContent = ({ content }) => {
    if (!content || !Array.isArray(content)) {
        return null;
    }

    return (
        <div className="article-content">
            {content.map((block, index) => {
                switch (block.type) {
                    case 'paragraph':
                        return (
                            <p 
                                key={index} 
                                className="article-paragraph"
                                dangerouslySetInnerHTML={{ __html: block.html }}
                            />
                        );
                    
                    case 'heading':
                        const HeadingTag = `h${block.level}`;
                        return (
                            <HeadingTag key={index} className="article-heading">
                                {block.text}
                            </HeadingTag>
                        );
                    
                    case 'blockquote':
                        return (
                            <blockquote key={index} className={`quote ${block.variant || 'default'}`}>
                                <p dangerouslySetInnerHTML={{ __html: block.html }} />
                                {block.footer && <footer>{block.footer}</footer>}
                            </blockquote>
                        );
                    
                    case 'list':
                        return (
                            <ul key={index} className="article-list">
                                {block.items.map((item, itemIndex) => (
                                    <li 
                                        key={itemIndex} 
                                        dangerouslySetInnerHTML={{ __html: item }}
                                    />
                                ))}
                            </ul>
                        );
                    
                    case 'highlight':
                        return (
                            <div key={index} className="highlight-box">
                                {block.title && <h3>{block.title}</h3>}
                                {block.content && block.content.map((contentBlock, contentIndex) => {
                                    if (contentBlock.type === 'list') {
                                        return (
                                            <ul key={contentIndex} className="article-list">
                                                {contentBlock.items.map((item, itemIndex) => (
                                                    <li 
                                                        key={itemIndex} 
                                                        dangerouslySetInnerHTML={{ __html: item }}
                                                    />
                                                ))}
                                            </ul>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        );
                    
                    case 'footer-note':
                        return (
                            <div key={index} className="article-footer-note">
                                <p dangerouslySetInnerHTML={{ __html: block.html }} />
                            </div>
                        );
                    
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default ArticleContent;