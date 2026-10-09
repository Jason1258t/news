import { useId, useState } from "react";
import type { EditorsPick, EditorsPickBadge } from "entities/editors-pick";
import { Button } from "shared/ui/button";
import { ErrorWidget } from "shared/ui/error-widget";
import { BadgesDialog } from "./BadgesDialog";
import styles from "./CurrentPicks.module.css";
import { PicksList } from "./PicksList";

interface CurrentPicksProps {
    picks: EditorsPick[];
    loading: boolean;
    saving: boolean;
    error: string | null;
    hasChanges: boolean;
    onRemove: (id: string) => void;
    onChangeBadge: (id: string, badge: EditorsPickBadge) => void;
    onSave: () => void;
    onReset: () => void;
}

export const CurrentPicks = ({
    picks,
    loading,
    saving,
    error,
    hasChanges,
    onRemove,
    onChangeBadge,
    onSave,
    onReset,
}: CurrentPicksProps) => {
    const [pickToChangeBadge, setPickToChangeBadge] = useState<string | null>(null);
    const titleId = useId();

    return (
        <>
            <section className={styles.root} aria-labelledby={titleId}>
                <h2 id={titleId} className={styles.title}>
                    Текущий выбор редакции
                </h2>
                <div className={styles.container}>
                    {error && <ErrorWidget message={error} />}
                    <PicksList
                        editorsPicks={picks}
                        loading={loading}
                        changeBadge={setPickToChangeBadge}
                        removeEditorsPick={onRemove}
                    />
                    <div className={styles.footer}>
                        <Button variant="secondary" onClick={onReset}>
                            Сбросить изменения
                        </Button>
                        <Button disabled={!hasChanges || saving} onClick={onSave}>
                            {saving ? "Ожидаем..." : "Подтвердить"}
                        </Button>
                    </div>
                </div>
            </section>

            <BadgesDialog
                isOpen={pickToChangeBadge !== null}
                onClose={() => setPickToChangeBadge(null)}
                onConfirm={(badge) => {
                    if (pickToChangeBadge) onChangeBadge(pickToChangeBadge, badge);
                }}
            />
        </>
    );
};
