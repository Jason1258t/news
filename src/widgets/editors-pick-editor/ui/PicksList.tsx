import { EditorsPickCard, type EditorsPick } from "entities/editors-pick";
import { FilledButton, OutlinedButton } from "shared/ui/button";
import { LoadingWidget } from "shared/ui/loading-widget";
import styles from "./CurrentPicks.module.css";

interface PicksListProps {
    loading: boolean;
    editorsPicks: EditorsPick[];
    removeEditorsPick: (id: string) => void;
    changeBadge: (id: string) => void;
}

export const PicksList = ({
    loading,
    editorsPicks,
    removeEditorsPick,
    changeBadge,
}: PicksListProps) => {
    if (loading)
        return (
            <div className={styles.picksList}>
                <LoadingWidget />
            </div>
        );
    if (editorsPicks.length === 0) {
        return <div className={styles.emptyMessage}>Тут пока пусто</div>;
    }
    return (
        <div className={styles.picksList}>
            {editorsPicks.map((e) => (
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                    }}
                    key={e.id}
                >
                    <div className={styles.cardContainer}>
                        <EditorsPickCard pick={e} />
                    </div>
                    <div className={styles.actionsContainer}>
                        <FilledButton
                            onClick={() => removeEditorsPick(e.id)}
                            color={{
                                backgroundColor: "var(--accent-red)",
                            }}
                        >
                            Удалить
                        </FilledButton>

                        <OutlinedButton onClick={() => changeBadge(e.id)}>
                            Изменить бейдж
                        </OutlinedButton>
                    </div>
                </div>
            ))}
        </div>
    );
};
