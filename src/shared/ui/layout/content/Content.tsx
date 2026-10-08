import type { ReactNode } from "react";
import styles from "./Content.module.css";

interface ContentProps {
    children: ReactNode;
    className?: string;
    size?: "small" | "medium" | "large";
}

export const Content = ({ children, className = "", size = "medium" }: ContentProps) => {
    return (
        <div
            className={`
      ${styles.content} 
      ${styles[size]}
      ${className}
    `.trim()}
        >
            {children}
        </div>
    );
};
