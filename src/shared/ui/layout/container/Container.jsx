import styles from './container.module.css';

export const Container = ({
    children,
    style,
    className = '',
    fullWidthOnMobile = false
}) => {
    return (
        <div className={`
      ${styles.container} 
      ${fullWidthOnMobile ? styles.fullWidthMobile : ''}
      ${className}
    `.trim()} style={styles}>
            {children}
        </div>
    );
};