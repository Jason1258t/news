import React from "react";
import styles from "./CurrentPicks.module.css";
import EditorsPickCard from "entities/editors-pick/ui";
import { editorsPicks } from "features/editors-pick/ui/picks";
import FilledButton from "widgets/buttons/FilledButton";
import OutlinedButton from "widgets/buttons/OutlinedButton";

const CurrentPicks = ({ changeBadge }) => {
    return (
        <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: "1rem" }}>Текущий выбор редакции</h2>
            <div className={styles.container}>
                {editorsPicks.map((e, i) => (
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className={styles.cardContainer} key={i}>
                            <EditorsPickCard pick={e} />
                        </div>
                        <div className={styles.actionsContainer}>
                            <FilledButton
                                onClick={() => {}}
                                color={{
                                    backgroundColor: "var(--accent-red)",
                                }}
                            >
                                Удалить
                            </FilledButton>

                            <OutlinedButton onClick={changeBadge}>
                                Изменить бейдж
                            </OutlinedButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurrentPicks;
