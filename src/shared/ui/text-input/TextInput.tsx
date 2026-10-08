import type { ChangeEvent, HTMLInputTypeAttribute } from "react";
import styles from "./TextInput.module.css";

interface TextInputProps {
    value: string;
    onChange?: (value: string) => void;
    label?: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
}

export const TextInput = ({
    value,
    onChange,
    label,
    placeholder = "",
    type = "text",
}: TextInputProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    };

    return (
        <div className={`${styles.container}`}>
            {label && <label className={styles.label}>{label}</label>}
            <input
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={styles.input}
            />
        </div>
    );
};
