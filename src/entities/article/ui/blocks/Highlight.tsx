import type { ReactNode } from "react";
import styles from "./Blocks.module.css";

interface HighlightProps {
    title?: string;
    /** Already rendered nested blocks. */
    content: ReactNode;
}

export const Highlight = ({ title, content }: HighlightProps) => (
    <div className={styles.highlight}>
        {title ? <h3>{title}</h3> : null}
        {content}
    </div>
);
