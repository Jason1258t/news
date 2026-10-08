import type { ReactNode } from "react";
import styles from "./Main.module.css";

export type MainSpacing = "none" | "compact" | "normal" | "loose";

interface MainProps {
    children: ReactNode;
    className?: string;
    spacing?: MainSpacing;
}

export const Main = ({ children, className = "", spacing = "normal" }: MainProps) => {
    return (
        <main
            className={`
      ${styles.main} 
      ${styles[spacing]}
      ${className}
    `.trim()}
        >
            {children}
        </main>
    );
};
