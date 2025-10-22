import React, { useState, useEffect } from "react";
import styles from "./DatePicker.module.css";

const DatePicker = ({
    value,
    onChange,
    label = "Выберите дату и время",
}) => {
    const [selectedDate, setSelectedDate] = useState(
        value || getCurrentDateTime()
    );

    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);

        // Вызываем колбек если он передан
        if (onChange) {
            onChange(newDate);
        }
    };

    // Синхронизация с внешним value
    useEffect(() => {
        if (value !== undefined) {
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

export default DatePicker;
