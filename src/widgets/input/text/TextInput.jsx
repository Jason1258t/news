import styles from "./TextInput.module.css";

const TextInput = ({
    value,
    onChange,
    label,
    placeholder = "",
    type = "text",
}) => {
    const handleChange = (e) => {
        const newValue = e.target.value;

        if (onChange) {
            onChange(newValue);
        }
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

export default TextInput;
