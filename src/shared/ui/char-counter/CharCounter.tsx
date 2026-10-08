import styles from "./CharCounter.module.css";

export const CharCounter = ({ length }: { length: number }) => {
    return <span className={styles.counter}>Символов: {length}</span>;
};
