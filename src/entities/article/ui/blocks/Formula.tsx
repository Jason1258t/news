import katex from "katex";
import "katex/dist/katex.min.css";
import type { ArticleFormulaBlock } from "../../model/types";

export const Formula = ({ formula, display = "inline" }: Omit<ArticleFormulaBlock, "type">) => {
    const html = katex.renderToString(formula, {
        displayMode: display === "block",
        throwOnError: false,
        output: "html",
    });

    if (display === "block") {
        return (
            <div className="formula-block">
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        );
    }

    return <span className="formula-inline" dangerouslySetInnerHTML={{ __html: html }} />;
};
