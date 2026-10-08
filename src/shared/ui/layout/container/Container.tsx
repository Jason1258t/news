import type { ReactNode } from "react";
import styles from "./Container.module.css";

interface ContainerProps {
    children: ReactNode;
    className?: string;
    fullWidthOnMobile?: boolean;
}

export const Container = ({
    children,
    className = "",
    fullWidthOnMobile = false,
}: ContainerProps) => {
    return (
        <div
            className={`
      ${styles.container} 
      ${fullWidthOnMobile ? styles.fullWidthMobile : ""}
      ${className}
    `.trim()}
        >
            {children}
        </div>
    );
};
