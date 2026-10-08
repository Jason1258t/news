export const CharCounter = ({ length }: { length: number }) => {
    return (
        <span style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>Символов: {length}</span>
    );
};
