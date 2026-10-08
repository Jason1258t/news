import type { MouseEventHandler, ReactNode } from "react";
import styles from "./Button.module.css";

interface OutlinedButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const OutlinedButton = ({ onClick, children }: OutlinedButtonProps) => {
    return (
        <button className={`${styles.btn} ${styles.btnOutlined}`} onClick={onClick}>
            {children}
        </button>
    );
};
