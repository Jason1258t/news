import styles from "./Surface.module.css";

export const Surface = ({ children, className = "", padding = true }) => {
    return (
        <div
            className={`
      ${styles.surface} 
      ${!padding ? styles.noPadding : ""}
      ${className}
    `.trim()}
        >
            {children}
        </div>
    );
};
