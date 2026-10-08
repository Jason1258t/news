import type { ReactNode } from "react";
import styles from "./Overlay.module.css";

export const Overlay = ({ children }: { children: ReactNode }) => {
    return <div className={styles.overlay}>{children}</div>;
};
