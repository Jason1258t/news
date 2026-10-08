import { useState } from "react";
import { FilledButton, OutlinedButton } from "shared/ui/button";
import { ErrorWidget } from "shared/ui/error-widget";
import type { EditorsPickStore } from "../model/useEditorsPickStore";
import { BadgesDialog } from "./BadgesDialog";
import styles from "./CurrentPicks.module.css";
import { PicksList } from "./PicksList";

export const CurrentPicks = ({ store }: { store: EditorsPickStore }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [pickToChangeBadge, setPickToChangeBadge] = useState<string | null>(null);
    const changeBadge = (pickId: string) => {
        setPickToChangeBadge(pickId);
        setIsOpen(true);
    };

    const {
        editorsPicks,
        loading,
        error,
        hasChanges,
        removeEditorsPick,
        updateEditorsPickBadge,
        saveAllChanges,
        resetChanges,
    } = store;

    return (
        <>
            <div style={{ flex: 1 }}>
                <h2 style={{ marginBottom: "1rem" }}>Текущий выбор редакции</h2>
                <div className={styles.container}>
                    {error ? (
                        <ErrorWidget message={error} />
                    ) : (
                        <>
                            <PicksList
                                editorsPicks={editorsPicks}
                                loading={loading}
                                changeBadge={changeBadge}
                                removeEditorsPick={removeEditorsPick}
                            />
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <OutlinedButton onClick={resetChanges}>
                                    Сбросить изменения
                                </OutlinedButton>
                                <FilledButton
                                    active={hasChanges && !loading}
                                    onClick={saveAllChanges}
                                >
                                    {loading ? "Ожидаем..." : "Подтвердить"}
                                </FilledButton>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <BadgesDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={(badge) => {
                    if (pickToChangeBadge) updateEditorsPickBadge(pickToChangeBadge, badge);
                }}
            />
        </>
    );
};
