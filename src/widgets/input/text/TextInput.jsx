import React, { useState, useEffect } from 'react';
import styles from './TextInput.module.css';

const TextInput = ({ 
  value = "",
  onChange,
  label,
  placeholder = "",
  type = "text",
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  };

  // Синхронизация с внешним value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={`${styles.container}`}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
};

export default TextInput;