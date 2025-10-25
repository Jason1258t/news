import React, { useState, useEffect } from "react";
import styles from "./DatePicker.module.css";

const DatePicker = ({ value, onChange, label = "Выберите дату и время" }) => {
    const [selectedDate, setSelectedDate] = useState(
        value || getCurrentDateTime()
    );

    function getCurrentDateTime() {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    }

    const handleDateChange = (e) => {
        const newDate = e.target.value ?? getCurrentDateTime();

        setSelectedDate(newDate);

        if (onChange) {
            onChange(newDate);
        }
    };

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
