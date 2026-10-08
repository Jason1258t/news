export const CharCounter = ({ length }: { length: number }) => {
    return (
        <span style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            Символов: {length}
        </span>
    );
};
