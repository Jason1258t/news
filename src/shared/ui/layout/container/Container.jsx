import styles from './container.module.css';

export const Container = ({
    children,
    className = '',
    fullWidthOnMobile = false
}) => {
    return (
        <div className={`
      ${styles.container} 
      ${fullWidthOnMobile ? styles.fullWidthMobile : ''}
      ${className}
    `.trim()}>
            {children}
        </div>
    );
};