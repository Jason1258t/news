import { useState } from "react";
import type { ArticlePreview } from "entities/article";
import type { EditorsPick, EditorsPickBadge } from "entities/editors-pick";

type PickSource = Pick<ArticlePreview, "title" | "description" | "url">;

const newPick = (source: PickSource): EditorsPick => ({
    id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    title: source.title,
    description: source.description,
    badge: "Must Read",
    articleUrl: source.url,
    createdAt: new Date(),
    updatedAt: new Date(),
});

/**
 * Local draft of the editors' pick on top of the saved list. Until the first edit the
 * saved list is shown as is; reset just drops the draft.
 */
export const useEditorsPickDraft = (saved: EditorsPick[] | undefined) => {
    const [draft, setDraft] = useState<EditorsPick[] | null>(null);
    const edit = (change: (picks: EditorsPick[]) => EditorsPick[]) =>
        setDraft((current) => change(current ?? saved ?? []));

    return {
        picks: draft ?? saved ?? [],
        hasChanges: draft !== null,
        add: (source: PickSource) => edit((picks) => [...picks, newPick(source)]),
        remove: (id: string) => edit((picks) => picks.filter((pick) => pick.id !== id)),
        changeBadge: (id: string, badge: EditorsPickBadge) =>
            edit((picks) =>
                picks.map((pick) =>
                    pick.id === id ? { ...pick, badge, updatedAt: new Date() } : pick,
                ),
            ),
        reset: () => setDraft(null),
    };
};
