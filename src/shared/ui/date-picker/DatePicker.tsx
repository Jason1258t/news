import { useId } from "react";
import styles from "./DatePicker.module.css";

interface DatePickerProps {
    /** Value in datetime-local format: YYYY-MM-DDTHH:mm (see toDateTimeLocal). */
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export const DatePicker = ({
    value,
    onChange,
    label = "Выберите дату и время",
}: DatePickerProps) => {
    const id = useId();
    return (
        <div className={styles.container}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <input
                id={id}
                type="datetime-local"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={styles.dateInput}
            />
        </div>
    );
};
