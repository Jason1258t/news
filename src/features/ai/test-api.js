import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "app/firebase";

import { useState, useEffect } from "react";

const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

// Wrap in an async function so you can use await
export async function run(prompt) {
    const result = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text();
    return text;
}

export const useAIAnswer = (prompt) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!prompt) return;

        const processPrompt = async () => {
            setLoading(true);
            setError(null);
            try {
                const asnwer = await run(prompt);
                setData(asnwer);
            } catch (err) {
                setError(
                    err.message || "Произошла ошибка при генерации контента"
                );
            } finally {
                setLoading(false);
            }
        };

        processPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, loading, error };
};
