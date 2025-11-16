import React from "react";

import styles from "./TextInput.module.css";

const TextArea = ({ value, onChange, label, placeholder = "", rows = 5 }) => {
    const handleChange = (e) => {
        const newValue = e.target.value;

        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className={`${styles.container}`}>
            {label && <label className={styles.label}>{label}</label>}
            <textarea
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={styles.input}
                rows={rows}
            />
        </div>
    );
};

export default TextArea;
