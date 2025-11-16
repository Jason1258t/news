import { create } from "zustand";
import { validatePredictions } from "./zodiacs";

const getNextWeek = () => {
    const today = new Date();
    const nextMonday = new Date(today);

    const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
    nextMonday.setDate(today.getDate() + daysUntilMonday);

    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    return { startDate: nextMonday, endDate: nextSunday };
};

export const useCreateHoroscopeStore = create((set, get) => {
    const { startDate, endDate } = getNextWeek();
    return {
        jsonInput: "",
        title: "",
        description: "",
        startDate: startDate,
        endDate: endDate,
        isValid: true,
        error: "",

        setJsonInput: (jsonInput) => {
            set({ jsonInput });
            get().validateJson();
        },

        setTitle: (v) => set({ title: v }),

        setDescription: (v) => set({ description: v }),

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
                    error: `Невалидный JSON: ${err.message}`,
                });
            }
            // validateJsonValue();
        },

        validateJsonValue: () => {
            const { isValid, jsonInput } = get();
            if (!isValid) return;

            const res = validatePredictions(jsonInput);
            if (!res.isValid) {
                set({ isValid: false, error: res.errors.join(" ") });
            }
        }
    };
});
