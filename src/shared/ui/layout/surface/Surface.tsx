import type { ReactNode } from "react";
import styles from "./Surface.module.css";

interface SurfaceProps {
    children: ReactNode;
    className?: string;
    padding?: boolean;
}

export const Surface = ({ children, className = "", padding = true }: SurfaceProps) => {
    return (
        <div
            className={`
      ${styles.surface} 
      ${!padding ? styles.noPadding : ""}
      ${className}
    `.trim()}
        >
            {children}
        </div>
    );
};
