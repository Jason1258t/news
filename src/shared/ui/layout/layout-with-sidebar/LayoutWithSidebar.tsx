import type { ReactNode } from "react";
import styles from "./LayoutWithSidebar.module.css";

type Props = { children: ReactNode };

const Root = ({ children }: Props) => <div className={styles.layout}>{children}</div>;

const MainContent = ({ children }: Props) => <div className={styles.mainContent}>{children}</div>;

const Sidebar = ({ children }: Props) => <aside className={styles.sidebar}>{children}</aside>;

export const LayoutWithSidebar = Object.assign(Root, { MainContent, Sidebar });
