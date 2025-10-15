import React from "react";
import { useState } from "react";
import styles from "./CurrentPicks.module.css";

import FilledButton from "widgets/buttons/FilledButton";
import OutlinedButton from "widgets/buttons/OutlinedButton";
import BadgesOverlay from "../BagesOverlay";
import ErrorWidget from "widgets/status/error";

import PicksList from "./PicksList";

const CurrentPicks = ({ store }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [pickToChangeBadge, setPickToChangeBadge] = useState(null);
    const changeBadge = (pickId) => {
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
                        <ErrorWidget message={error?.message} />
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

            <BadgesOverlay
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={(badge) =>
                    updateEditorsPickBadge(pickToChangeBadge, badge)
                }
            />
        </>
    );
};

export default CurrentPicks;
