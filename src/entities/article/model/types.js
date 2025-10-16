/**
 * @typedef {Object} ArticleOG
 * @property {string} url
 * @property {string} image
 * @property {string=} title
 * @property {string=} description
 */

/**
 * @typedef {Object} ArticleHero
 * @property {string} url
 * @property {string} alt
 * @property {string=} caption
 */

/**
 * @typedef {Object} ArticleHeadingBlock
 * @property {"heading"} type
 * @property {2|3|4} level
 * @property {string} text
 */

/**
 * @typedef {Object} ArticleParagraphBlock
 * @property {"paragraph"} type
 * @property {string} html // supports inline <strong>, <em>, <a>, etc.
 */

/**
 * @typedef {Object} ArticleListBlock
 * @property {"list"} type
 * @property {Array<string>} items // items allow inline HTML
 */

/**
 * @typedef {Object} ArticleImageBlock
 * @property {"image"} type
 * @property {string} url
 * @property {string} alt
 * @property {string=} caption
 */

/**
 * @typedef {Object} ArticleBlockquoteBlock
 * @property {"blockquote"} type
 * @property {string} html
 * @property {string=} footer
 * @property {"default"|"warning"|"critical"=} variant
 */

/**
 * @typedef {Object} ArticleHighlightBlock
 * @property {"highlight"} type
 * @property {string=} title
 * @property {Array<ArticleParagraphBlock|ArticleListBlock>} content
 */

/**
 * @typedef {Object} ArticleFooterNoteBlock
 * @property {"footer-note"} type
 * @property {string} html
 */

/**
 * @typedef {Object} ArticleFormulaBlock
 * @property {"formula"} type
 * @property {string} formula // LaTeX формула
 * @property {"inline"|"block"=} display
 */

/**
 * @typedef {Object} ArticleCodeBlock
 * @property {"code"} type
 * @property {string} code
 * @property {string=} language
 * @property {string=} filename
 */

/**
 * @typedef {Object} ArticleTableBlock
 * @property {"table"} type
 * @property {Array<Array<string>>} data // 2D массив данных
 * @property {boolean=} hasHeader // есть ли строка заголовка
 */

/**
 * @typedef {(
 *  ArticleHeadingBlock|
 *  ArticleParagraphBlock|
 *  ArticleListBlock|
 *  ArticleImageBlock|
 *  ArticleBlockquoteBlock|
 *  ArticleHighlightBlock|
 *  ArticleFooterNoteBlock|
 *  ArticleFormulaBlock|
 *  ArticleCodeBlock|
 *  ArticleTableBlock
 * )} ArticleContentBlock
 */

/**
 * @typedef {Object} Article
 * @property {string} slug
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {string} dateDisplay
 * @property {string} datePublishedISO
 * @property {string} author
 * @property {string[]} tags
 * @property {ArticleHero} hero
 * @property {ArticleOG=} og
 * @property {Array<ArticleContentBlock>} content
 */

export {}; // JSDoc-only typedefs module
