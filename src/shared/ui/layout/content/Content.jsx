import styles from "./Content.module.css";

export const Content = ({
    children,
    className = "",
    size = "medium", // 'small' | 'medium' | 'large'
}) => {
    return (
        <div
            className={`
      ${styles.content} 
      ${styles[size]}
      ${className}
    `.trim()}
        >
            {children}
        </div>
    );
};
