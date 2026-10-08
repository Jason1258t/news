import { useState } from "react";
import { EDITORS_PICK_BADGES, type EditorsPickBadge } from "entities/editors-pick";
import { Button } from "shared/ui/button";
import styles from "./BadgesDialog.module.css";

interface BadgesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (badge: EditorsPickBadge) => void;
}

export const BadgesDialog = ({ isOpen, onClose, onConfirm }: BadgesDialogProps) => {
    const [selectedCategory, setSelectedCategory] = useState<EditorsPickBadge | null>(null);

    const handleBadgeClick = (category: EditorsPickBadge) => {
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
                    {EDITORS_PICK_BADGES.map((bage) => (
                        <button
                            key={bage}
                            className={`${styles.badge} ${
                                selectedCategory === bage ? styles.badgeSelected : ""
                            }`}
                            onClick={() => handleBadgeClick(bage)}
                            type="button"
                        >
                            {bage}
                        </button>
                    ))}
                </div>

                <div className={styles.overlayActions}>
                    <Button variant="secondary" onClick={handleCancel}>
                        Отмена
                    </Button>
                    <Button onClick={handleConfirm} disabled={selectedCategory === null}>
                        Подтвердить
                    </Button>
                </div>
            </div>
        </div>
    );
};
