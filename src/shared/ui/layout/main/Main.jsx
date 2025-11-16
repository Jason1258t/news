import styles from './main.module.css';

export const Main = ({ 
  children, 
  className = '',
  spacing = 'normal' // 'none' | 'compact' | 'normal' | 'loose'
}) => {
  return (
    <main className={`
      ${styles.main} 
      ${styles[spacing]}
      ${className}
    `.trim()}>
      {children}
    </main>
  );
};