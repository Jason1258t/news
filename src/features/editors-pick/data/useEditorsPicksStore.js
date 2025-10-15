import { create } from "zustand";
import {
    fetchEditorsPicks,
    createEditorsPick,
    deleteEditorsPick,
} from "../api/editors-pick-api";

export const useEditorsPickStore = create((set, get) => ({
    editorsPicks: [],
    loading: false,
    error: null,
    hasChanges: false,

    loadEditorsPicks: async (badge = null) => {
        set({ loading: true, error: null });
        try {
            const picks = await fetchEditorsPicks(badge);
            set({
                editorsPicks: picks,
                loading: false,
                hasChanges: false,
            });
        } catch (error) {
            set({
                error: error.message,
                loading: false,
            });
        }
    },

    addEditorsPick: (articleOG) => {
        const { editorsPicks } = get();

        const newPick = {
            id: `local_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
            title: articleOG.title || "",
            description: articleOG.description || "",
            badge: articleOG.badge || "Must Read",
            articleUrl: articleOG.url || "",
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
        const updatedPicks = editorsPicks.filter((pick) => pick.id !== id);

        set({
            editorsPicks: updatedPicks,
            hasChanges: true,
        });
    },

    updateEditorsPickBadge: (id, newBadge) => {
        const { editorsPicks } = get();
        const updatedPicks = editorsPicks.map((pick) =>
            pick.id === id
                ? {
                      ...pick,
                      badge: newBadge,
                      updatedAt: new Date(),
                  }
                : pick
        );

        set({
            editorsPicks: updatedPicks,
            hasChanges: true,
        });
    },

    saveAllChanges: async () => {
        const { editorsPicks, loadEditorsPicks } = get();

        set({ loading: true, error: null });

        try {
            const currentPicks = await fetchEditorsPicks();

            const deletePromises = currentPicks.map((pick) =>
                deleteEditorsPick(pick.id)
            );
            await Promise.all(deletePromises);

            const createPromises = editorsPicks.map((pick) => {
                const { id, ...pickData } = pick;

                return createEditorsPick(pickData);
            });

            const results = await Promise.all(createPromises);

            const hasErrors = results.some((result) => !result.success);
            if (hasErrors) {
                throw new Error("Некоторые записи не удалось сохранить");
            }

            await loadEditorsPicks();

            set({
                loading: false,
                hasChanges: false,
            });

            return { success: true };
        } catch (error) {
            set({
                error: error.message,
                loading: false,
            });
            return {
                success: false,
                error: error.message,
            };
        }
    },

    // Сброс локальных изменений и перезагрузка из БД
    resetChanges: async () => {
        await get().loadEditorsPicks();
    },

    // Очистка ошибок
    clearError: () => set({ error: null }),
}));
