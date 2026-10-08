import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
import styles from "./Button.module.css";

interface FilledButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    /** Inline style override, e.g. a custom background. */
    color?: CSSProperties;
    /** false disables the button. */
    active?: boolean;
    type?: "button" | "submit" | "reset";
}

export const FilledButton = ({
    onClick,
    children,
    color = { backgroundColor: "none" },
    active = true,
    type,
}: FilledButtonProps) => {
    return (
        <button
            disabled={!active}
            className={`${styles.btn} ${styles.btnFilled}`}
            onClick={onClick}
            style={color}
            type={type}
        >
            {children}
        </button>
    );
};
