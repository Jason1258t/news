import type { EditorsPick } from "../model/types";
import styles from "./EditorsPickCard.module.css";

interface EditorsPickCardProps {
    /** Badge is absent when the card previews an article that is not picked yet. */
    pick: Partial<Pick<EditorsPick, "title" | "badge">>;
}

export const EditorsPickCard = ({ pick }: EditorsPickCardProps) => {
    return (
        <div className={styles.pickItem}>
            <div className={styles.pickBadge}>{pick.badge}</div>
            <h4 className={styles.pickTitle}>{pick.title}</h4>
        </div>
    );
};
