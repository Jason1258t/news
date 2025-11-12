import { create } from 'zustand';

export const useCreateArticleStore = create((set, get) => ({
  jsonInput: '',
  imageUrl: null,
  date: new Date(),
  isValid: true,
  error: '',

  setJsonInput: (jsonInput) => {
    set({ jsonInput });
    get().validateJson();
  },

  setImageUrl: (imageUrl) => set({ imageUrl }),

  setDate: (date) => set({ date }),

  setError: (error) => set({ error }),

  resetForm: () => set({
    jsonInput: '',
    imageUrl: null,
    date: new Date(),
    isValid: true,
    error: ''
  }),

  validateJson: () => {
    const { jsonInput } = get();
    
    if (!jsonInput.trim()) {
      set({ isValid: true, error: '' });
      return;
    }

    try {
      JSON.parse(jsonInput);
      set({ isValid: true, error: '' });
    } catch (err) {
      set({ 
        isValid: false, 
        error: `Невалидный JSON: ${err.message}` 
      });
    }
  }
}));