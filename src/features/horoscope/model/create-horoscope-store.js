import { create } from "zustand";

const getNextWeek = () => {
    const today = new Date();
    const nextMonday = new Date(today);

    // Переход к следующему понедельнику
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
    nextMonday.setDate(today.getDate() + daysUntilMonday);

    // Конец недели - воскресенье
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    return { startDate: nextMonday, endDate: nextSunday };
};

export const useCreateHoroscopeStore = create((set, get) => {
    const { startDate, endDate } = getNextWeek();
    return {
        jsonInput: "",
        startDate: startDate,
        endDate: endDate,
        isValid: true,
        error: "",

        setJsonInput: (jsonInput) => {
            set({ jsonInput });
            get().validateJson();
        },

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
                    error: `Невалидный JSON: ${err.message}`,
                });
            }
        },
    };
});
