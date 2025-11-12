import React from "react";
import styles from "./Buttons.module.css";

const FilledButton = ({
    onClick,
    children,
    color = { backgroundColor: "none" },
    active = true,
    type
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

export default FilledButton;
