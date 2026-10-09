import { useId, useState } from "react";
import { EDITORS_PICK_BADGES, type EditorsPickBadge } from "entities/editors-pick";
import { Button } from "shared/ui/button";
import { Dialog } from "shared/ui/dialog";
import styles from "./BadgesDialog.module.css";

interface BadgesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (badge: EditorsPickBadge) => void;
}

export const BadgesDialog = ({ isOpen, onClose, onConfirm }: BadgesDialogProps) => {
    const [selectedBadge, setSelectedBadge] = useState<EditorsPickBadge | null>(null);
    const titleId = useId();

    const handleConfirm = () => {
        if (selectedBadge) {
            onConfirm(selectedBadge);
            setSelectedBadge(null);
            onClose();
        }
    };

    const handleCancel = () => {
        setSelectedBadge(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog labelledBy={titleId} onClose={handleCancel} className={styles.dialog}>
            <h3 id={titleId}>Выберите бейдж</h3>

            <div className={styles.badgesContainer}>
                {EDITORS_PICK_BADGES.map((badge) => (
                    <button
                        key={badge}
                        className={`${styles.badge} ${
                            selectedBadge === badge ? styles.badgeSelected : ""
                        }`}
                        onClick={() => setSelectedBadge(badge)}
                        aria-pressed={selectedBadge === badge}
                        type="button"
                    >
                        {badge}
                    </button>
                ))}
            </div>

            <div className={styles.actions}>
                <Button variant="secondary" onClick={handleCancel}>
                    Отмена
                </Button>
                <Button onClick={handleConfirm} disabled={selectedBadge === null}>
                    Подтвердить
                </Button>
            </div>
        </Dialog>
    );
};
