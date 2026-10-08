import type { ReactNode } from "react";

interface HighlightProps {
    title?: string;
    /** Already rendered nested blocks. */
    content: ReactNode;
}

export const Highlight = ({ title, content }: HighlightProps) => (
    <div className="highlight-box">
        {title ? <h3>{title}</h3> : null}
        {content}
    </div>
);
