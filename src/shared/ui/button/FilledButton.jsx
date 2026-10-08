import React from "react";
import styles from "./Button.module.css";

export const FilledButton = ({
    onClick,
    children,
    color = { backgroundColor: "none" },
    active = true,
    type,
}) => {
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
