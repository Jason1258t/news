import styles from "./TodoFilter.module.css";

export type TodoFilterValue = "all" | "active" | "completed";

const FILTERS: Array<{ value: TodoFilterValue; label: string }> = [
    { value: "all", label: "Все" },
    { value: "active", label: "Активные" },
    { value: "completed", label: "Завершённые" },
];

interface TodoFilterProps {
    filter: TodoFilterValue;
    onFilterChange: (filter: TodoFilterValue) => void;
}

export const TodoFilter = ({ filter, onFilterChange }: TodoFilterProps) => {
    return (
        <div className={styles.container}>
            {FILTERS.map((f) => (
                <button
                    key={f.value}
                    type="button"
                    aria-pressed={filter === f.value}
                    className={filter === f.value ? styles.buttonActive : styles.button}
                    onClick={() => onFilterChange(f.value)}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
};
