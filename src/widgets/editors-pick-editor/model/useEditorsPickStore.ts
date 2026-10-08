import { create } from "zustand";
import type { ArticlePreview } from "entities/article";
import {
    createEditorsPick,
    deleteEditorsPick,
    fetchEditorsPicks,
    type EditorsPick,
    type EditorsPickBadge,
} from "entities/editors-pick";
import { getErrorMessage } from "shared/lib/error";

interface EditorsPickState {
    editorsPicks: EditorsPick[];
    loading: boolean;
    error: string | null;
    hasChanges: boolean;
    loadEditorsPicks: () => Promise<void>;
    addEditorsPick: (preview: Pick<ArticlePreview, "title" | "description" | "url">) => EditorsPick;
    removeEditorsPick: (id: string) => void;
    updateEditorsPickBadge: (id: string, badge: EditorsPickBadge) => void;
    saveAllChanges: () => Promise<{ success: boolean; error?: string }>;
    resetChanges: () => Promise<void>;
    clearError: () => void;
}

/** Local draft of the editors' pick; nothing is written to Firestore until saveAllChanges. */
export const useEditorsPickStore = create<EditorsPickState>()((set, get) => ({
    editorsPicks: [],
    loading: false,
    error: null,
    hasChanges: false,

    loadEditorsPicks: async () => {
        set({ loading: true, error: null });
        try {
            const picks = await fetchEditorsPicks();
            set({
                editorsPicks: picks,
                loading: false,
                hasChanges: false,
            });
        } catch (error) {
            set({
                error: getErrorMessage(error),
                loading: false,
            });
        }
    },

    addEditorsPick: (preview) => {
        const { editorsPicks } = get();

        const newPick: EditorsPick = {
            id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
            title: preview.title,
            description: preview.description,
            badge: "Must Read",
            articleUrl: preview.url,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        set({
            editorsPicks: [...editorsPicks, newPick],
            hasChanges: true,
        });

        return newPick;
    },

    removeEditorsPick: (id) => {
        const { editorsPicks } = get();

        set({
            editorsPicks: editorsPicks.filter((pick) => pick.id !== id),
            hasChanges: true,
        });
    },

    updateEditorsPickBadge: (id, newBadge) => {
        const { editorsPicks } = get();
        const updatedPicks = editorsPicks.map((pick) =>
            pick.id === id ? { ...pick, badge: newBadge, updatedAt: new Date() } : pick,
        );

        set({
            editorsPicks: updatedPicks,
            hasChanges: true,
        });
    },

    // TODO(stage 2): not atomic — delete-all then create-all loses the pick on failure (B7).
    saveAllChanges: async () => {
        const { editorsPicks, loadEditorsPicks } = get();

        set({ loading: true, error: null });

        try {
            const currentPicks = await fetchEditorsPicks();

            await Promise.all(currentPicks.map((pick) => deleteEditorsPick(pick.id)));

            const results = await Promise.all(
                editorsPicks.map(({ title, description, badge, articleUrl }) =>
                    createEditorsPick({ title, description, badge, articleUrl }),
                ),
            );

            if (results.some((result) => !result.success)) {
                throw new Error("Некоторые записи не удалось сохранить");
            }

            await loadEditorsPicks();

            set({
                loading: false,
                hasChanges: false,
            });

            return { success: true };
        } catch (error) {
            const message = getErrorMessage(error);
            set({
                error: message,
                loading: false,
            });
            return {
                success: false,
                error: message,
            };
        }
    },

    // Сброс локальных изменений и перезагрузка из БД
    resetChanges: async () => {
        await get().loadEditorsPicks();
    },

    clearError: () => set({ error: null }),
}));

export type EditorsPickStore = ReturnType<typeof useEditorsPickStore.getState>;
