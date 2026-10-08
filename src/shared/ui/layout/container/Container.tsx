import type { CSSProperties, ReactNode } from "react";
import styles from "./Container.module.css";

interface ContainerProps {
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
    fullWidthOnMobile?: boolean;
}

export const Container = ({
    children,
    style,
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
            style={style}
        >
            {children}
        </div>
    );
};
