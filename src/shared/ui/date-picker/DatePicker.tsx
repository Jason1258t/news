import { useEffect, useState, type ChangeEvent } from "react";
import styles from "./DatePicker.module.css";

interface DatePickerProps {
    /** Value in datetime-local format: YYYY-MM-DDTHH:mm. */
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
}

export const DatePicker = ({
    value,
    onChange,
    label = "Выберите дату и время",
}: DatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState(value || getCurrentDateTime());

    function getCurrentDateTime() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value ?? getCurrentDateTime();

        setSelectedDate(newDate);

        if (onChange) {
            onChange(newDate);
        }
    };

    useEffect(() => {
        if (value !== undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- TODO(stage 4): make the input fully controlled
            setSelectedDate(value);
        }
    }, [value]);

    return (
        <div className={`${styles.container}`}>
            <label htmlFor="dateInput" className={styles.label}>
                {label}
            </label>
            <input
                id="dateInput"
                type="datetime-local"
                value={selectedDate}
                onChange={handleDateChange}
                className={styles.dateInput}
            />
        </div>
    );
};
