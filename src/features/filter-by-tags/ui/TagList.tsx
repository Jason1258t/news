import styles from "./TagList.module.css";

interface TagListProps {
    selectedTags?: string[];
    onRemoveTag: (tag: string) => void;
    onClearAll: () => void;
}

export const TagList = ({ selectedTags = [], onRemoveTag, onClearAll }: TagListProps) => {
    if (selectedTags.length === 0) {
        return null;
    }

    return (
        <div className={styles.tagsContainer}>
            <div className={styles.tagsList}>
                {selectedTags.map((tag, index) => (
                    <div key={index} className={styles.tagItem}>
                        <span className={styles.tagText}>{tag}</span>
                        <button
                            className={styles.removeButton}
                            onClick={() => onRemoveTag(tag)}
                            type="button"
                            aria-label={`Удалить тег ${tag}`}
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button className={styles.clearButton} onClick={onClearAll} type="button">
                    Очистить все
                </button>
            </div>
        </div>
    );
};
