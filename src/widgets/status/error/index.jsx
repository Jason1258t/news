import React from 'react';
import styles from './ErrorWidget.module.css';
import FilledButton from 'widgets/buttons/FilledButton';

const ErrorWidget = ({ message = "Произошла ошибка", onRetry }) => {
    return (
        <div className={styles.widget}>
            <div className={styles.icon}>⚠️</div>
            <h2 className={styles.title}>Упс! Что-то пошло не так</h2>
            <p className={styles.description}>{message}</p>
            {onRetry && (
                <FilledButton  onClick={onRetry}>
                     Попробовать снова
                </FilledButton>
            )}
        </div>
    );
};

export default ErrorWidget;