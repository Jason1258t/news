import type { ReactNode } from "react";
import styles from "./LayoutWithSidebar.module.css";

type Props = { children: ReactNode };

const MainContent = ({ children }: Props) => <div className={styles.mainContent}>{children}</div>;

const Sidebar = ({ children }: Props) => <aside className={styles.sidebar}>{children}</aside>;

export function LayoutWithSidebar({ children }: Props) {
    return <div className={styles.layout}>{children}</div>;
}

LayoutWithSidebar.MainContent = MainContent;
LayoutWithSidebar.Sidebar = Sidebar;
