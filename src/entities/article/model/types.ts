import type { z } from "zod";
import type {
    articleHeroSchema,
    articleInputSchema,
    articleOgSchema,
    blockquoteBlockSchema,
    codeBlockSchema,
    contentBlockSchema,
    footerNoteBlockSchema,
    formulaBlockSchema,
    headingBlockSchema,
    highlightBlockSchema,
    imageBlockSchema,
    listBlockSchema,
    paragraphBlockSchema,
    tableBlockSchema,
} from "./schema";

export type ArticleHeadingBlock = z.infer<typeof headingBlockSchema>;
export type ArticleParagraphBlock = z.infer<typeof paragraphBlockSchema>;
export type ArticleListBlock = z.infer<typeof listBlockSchema>;
export type ArticleImageBlock = z.infer<typeof imageBlockSchema>;
export type ArticleBlockquoteBlock = z.infer<typeof blockquoteBlockSchema>;
export type ArticleHighlightBlock = z.infer<typeof highlightBlockSchema>;
export type ArticleFooterNoteBlock = z.infer<typeof footerNoteBlockSchema>;
export type ArticleFormulaBlock = z.infer<typeof formulaBlockSchema>;
export type ArticleCodeBlock = z.infer<typeof codeBlockSchema>;
export type ArticleTableBlock = z.infer<typeof tableBlockSchema>;
export type ArticleContentBlock = z.infer<typeof contentBlockSchema>;

export type ArticleHero = z.infer<typeof articleHeroSchema>;
export type ArticleOG = z.infer<typeof articleOgSchema>;

/** Статья в том виде, в котором её загружают из админки. */
export type ArticleInput = z.infer<typeof articleInputSchema>;

/** Документ статьи в Firestore. Старые документы могут быть неполными, поэтому всё опционально. */
export type ArticleDoc = Partial<Omit<ArticleInput, "slug">>;

/** Статья, подготовленная для отображения. */
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
