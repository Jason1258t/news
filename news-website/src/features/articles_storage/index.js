import { gossvatArticle } from "./articles/gossvat";
import { aiWarningArticle } from "./articles/aiWarning";
import { onlineCompilersArticle } from "./articles/onlineComplillers";
import { gossvat2Article } from "./articles/gossvat2";
import pancakesArticle from "./articles/pancakes";
import { porkConspiracyArticle } from "./articles/porkConspiracyArticle";

const articles = [
    porkConspiracyArticle,
    pancakesArticle,
    aiWarningArticle,
    onlineCompilersArticle,
    gossvat2Article,
    gossvatArticle,
];

export const articlesStorage = Object.fromEntries(
    articles.map((article) => [article.slug, article])
);
