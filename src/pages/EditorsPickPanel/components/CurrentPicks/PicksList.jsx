import React from "react";
import styles from "./CurrentPicks.module.css";
import LoadingWidget from "widgets/status/loading";
import EditorsPickCard from "entities/editors-pick/ui";
import FilledButton from "widgets/buttons/FilledButton";
import OutlinedButton from "widgets/buttons/OutlinedButton";

const PicksList = ({
    loading,
    editorsPicks,
    removeEditorsPick,
    changeBadge,
}) => {
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
            {editorsPicks.map((e, i) => (
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                    }}
                    key={i}
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

export default PicksList;
