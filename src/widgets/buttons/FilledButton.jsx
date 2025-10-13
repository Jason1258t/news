import React from "react";
import styles from "./Buttons.module.css";

const FilledButton = ({ onClick, children }) => {
    return (
        <button
            className={`${styles.btn} ${styles.btnFilled}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default FilledButton;
