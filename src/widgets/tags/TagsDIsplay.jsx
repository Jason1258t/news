import React from "react";
import styles from "./TagsDisplay.module.css";

const TagsDisplay = ({ selectedTags = [], onRemoveTag, onClearAll }) => {
    if (!selectedTags || selectedTags.length === 0) {
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
                {selectedTags.length > 0 && (
                    <button
                        className={styles.clearButton}
                        onClick={onClearAll}
                        type="button"
                    >
                        Очистить все
                    </button>
                )}
            </div>
        </div>
    );
};

export default TagsDisplay;
