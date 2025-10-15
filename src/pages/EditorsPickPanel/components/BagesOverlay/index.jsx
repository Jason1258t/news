import React, { useState } from "react";
import FilledButton from "widgets/buttons/FilledButton";
import styles from "./Overlay.module.css";
import OutlinedButton from "widgets/buttons/OutlinedButton";

const bages = [
    "Must Read",
    "Deep Dive",
    "Trending",
    "Case Study",
    "Tutorial",
    "Research",
];

const BadgesOverlay = ({ isOpen, onClose, onConfirm }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleBadgeClick = (category) => {
        setSelectedCategory(category);
    };

    const handleConfirm = () => {
        if (selectedCategory) {
            onConfirm(selectedCategory);
            setSelectedCategory(null);
            onClose();
        }
    };

    const handleCancel = () => {
        setSelectedCategory(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.overlayContent}>
                <h3>Выберите бейдж</h3>

                <div className={styles.badgesContainer}>
                    {bages.map((bage) => (
                        <button
                            key={bage}
                            className={`${styles.badge} ${
                                selectedCategory === bage
                                    ? styles.badgeSelected
                                    : ""
                            }`}
                            onClick={() => handleBadgeClick(bage)}
                            type="button"
                        >
                            {bage}
                        </button>
                    ))}
                </div>

                <div className={styles.overlayActions}>
                    <OutlinedButton onClick={handleCancel}>
                        Отмена
                    </OutlinedButton>
                    <FilledButton
                        onClick={handleConfirm}
                        active={selectedCategory}
                    >
                        Подтвердить
                    </FilledButton>
                </div>
            </div>
        </div>
    );
};

export default BadgesOverlay;
