import React from 'react';
import styles from './Filter.module.css';

const Filter = ({ filter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'Все' },
    { value: 'active', label: 'Активные' },
    { value: 'completed', label: 'Завершённые' }
  ];

  return (
    <div className={styles.container}>
      {filters.map(f => (
        <button
          key={f.value}
          className={filter === f.value ? styles.buttonActive : styles.button}
          onClick={() => onFilterChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default Filter;