import React from "react";
import styles from "./Buttons.module.css";

const OutlinedButton = ({ onClick, children }) => {
    return (
        <button
            className={`${styles.btn} ${styles.btnOutlined}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default OutlinedButton;
