import { create } from "zustand";
import { getErrorMessage } from "shared/lib/error";

interface CreateArticleState {
    jsonInput: string;
    imageUrl: string | null;
    /** Publication date: Date initially, datetime-local string after the user picks one. */
    date: Date | string;
    isValid: boolean;
    error: string;
    setJsonInput: (jsonInput: string) => void;
    setImageUrl: (imageUrl: string | null) => void;
    setDate: (date: Date | string) => void;
    setError: (error: string) => void;
    validateJson: () => void;
}

export const useCreateArticleStore = create<CreateArticleState>()((set, get) => ({
    jsonInput: "",
    imageUrl: null,
    date: new Date(),
    isValid: true,
    error: "",

    setJsonInput: (jsonInput) => {
        set({ jsonInput });
        get().validateJson();
    },

    setImageUrl: (imageUrl) => set({ imageUrl }),

    setDate: (date) => set({ date }),

    setError: (error) => set({ error }),

    validateJson: () => {
        const { jsonInput } = get();

        if (!jsonInput.trim()) {
            set({ isValid: true, error: "" });
            return;
        }

        try {
            JSON.parse(jsonInput);
            set({ isValid: true, error: "" });
        } catch (err) {
            set({
                isValid: false,
                error: `Невалидный JSON: ${getErrorMessage(err)}`,
            });
        }
    },
}));
