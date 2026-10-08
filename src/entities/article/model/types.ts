export interface ArticleOG {
    url: string;
    image: string;
    title?: string;
    description?: string;
}

export interface ArticleHero {
    url: string;
    alt: string;
    caption?: string;
}

export interface ArticleHeadingBlock {
    type: "heading";
    level: 2 | 3 | 4;
    text: string;
}

export interface ArticleParagraphBlock {
    type: "paragraph";
    /** Inline HTML: <strong>, <em>, <a> и т.п. */
    html: string;
}

export interface ArticleListBlock {
    type: "list";
    /** Элементы могут содержать inline HTML. */
    items: string[];
}

export interface ArticleImageBlock {
    type: "image";
    url: string;
    alt: string;
    caption?: string;
}

export interface ArticleBlockquoteBlock {
    type: "blockquote";
    html: string;
    footer?: string;
    variant?: "default" | "warning" | "critical";
}

export interface ArticleHighlightBlock {
    type: "highlight";
    title?: string;
    content: Array<ArticleParagraphBlock | ArticleListBlock>;
}

export interface ArticleFooterNoteBlock {
    type: "footer-note";
    html: string;
}

export interface ArticleFormulaBlock {
    type: "formula";
    /** LaTeX */
    formula: string;
    display?: "inline" | "block";
}

export interface ArticleCodeBlock {
    type: "code";
    code: string;
    language?: string;
    filename?: string;
}

export interface ArticleTableBlock {
    type: "table";
    data: string[][];
    hasHeader?: boolean;
}

export type ArticleContentBlock =
    | ArticleHeadingBlock
    | ArticleParagraphBlock
    | ArticleListBlock
    | ArticleImageBlock
    | ArticleBlockquoteBlock
    | ArticleHighlightBlock
    | ArticleFooterNoteBlock
    | ArticleFormulaBlock
    | ArticleCodeBlock
    | ArticleTableBlock;

export interface Article {
    slug: string;
    title: string;
    description: string;
    /** Категории, склеенные через « • » для отображения. */
    category: string;
    dateDisplay: string;
    datePublishedISO: string;
    author: string;
    tags: string[];
    hero: ArticleHero;
    og: Partial<ArticleOG>;
    content: ArticleContentBlock[];
}

/** Документ статьи в Firestore (без id — он хранится как slug документа). */
export interface ArticleDoc {
    title?: string;
    description?: string;
    category?: string[];
    datePublishedISO?: string;
    author?: string;
    tags?: string[];
    hero?: ArticleHero;
    og?: Partial<ArticleOG>;
    content?: ArticleContentBlock[];
}
