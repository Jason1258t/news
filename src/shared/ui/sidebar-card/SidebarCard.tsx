import type { ReactNode } from "react";
import styles from "./SidebarCard.module.css";

interface SidebarCardProps {
    children: ReactNode;
    title?: string;
    onClick?: () => void;
}

export const SidebarCard = ({ children, title, onClick }: SidebarCardProps) => {
    return (
        <div className={`${styles.widget} ${onClick ? styles.clickable : ""}`} onClick={onClick}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {children}
        </div>
    );
};
