import React from "react";
import styles from './LayoutWithSidebar.module.css';

export const LayoutWithSidebar = ({ children }) => {
  return <div className={styles.layout}>{children}</div>;
};

const MainContent = ({ children }) => (
  <div className={styles.mainContent}>{children}</div>
);

const Sidebar = ({ children }) => (
  <aside className={styles.sidebar}>{children}</aside>
);

LayoutWithSidebar.MainContent = MainContent;
LayoutWithSidebar.Sidebar = Sidebar;
