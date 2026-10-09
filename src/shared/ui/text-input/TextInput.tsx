import { useId, type HTMLInputTypeAttribute } from "react";
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
    const id = useId();

    return (
        <div className={styles.container}>
            {label && (
                <label htmlFor={id} className={styles.label}>
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
                placeholder={placeholder}
                className={styles.input}
            />
        </div>
    );
};
