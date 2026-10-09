import toast from "react-hot-toast";
import { getArticlePreview } from "entities/article";
import { useEditorsPicks } from "entities/editors-pick";
import { useEditorsPickDraft } from "../model/useEditorsPickDraft";
import { useSaveEditorsPicks } from "../model/useSaveEditorsPicks";
import { ArticlesList } from "./ArticlesList";
import { CurrentPicks } from "./CurrentPicks";
import styles from "./EditorsPickEditor.module.css";

export const EditorsPickEditor = () => {
    const { data: saved, isLoading, error } = useEditorsPicks();
    const draft = useEditorsPickDraft(saved);
    const save = useSaveEditorsPicks();

    const handleSave = async () => {
        try {
            await save.mutateAsync(draft.picks);
            draft.reset();
            toast.success("Выбор редакции сохранён");
        } catch {
            // the error is shown by CurrentPicks; the draft stays so nothing is lost
        }
    };

    return (
        <div className={styles.editor}>
            <ArticlesList onArticleSelected={(article) => draft.add(getArticlePreview(article))} />
            <CurrentPicks
                picks={draft.picks}
                loading={isLoading}
                saving={save.isPending}
                error={error?.message ?? save.error?.message ?? null}
                hasChanges={draft.hasChanges}
                onRemove={draft.remove}
                onChangeBadge={draft.changeBadge}
                onSave={handleSave}
                onReset={draft.reset}
            />
        </div>
    );
};
