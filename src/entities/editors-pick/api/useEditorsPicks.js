import { useState, useEffect } from "react";
import { fetchEditorsPicks } from "./editors-pick-api";

/**
 * Хук для получения редакционной подборки (только чтение)
 * @returns {{
 *   editorsPicks: EditorsPick[],
 *   loading: boolean,
 *   error: string | null,
 *   refetch: () => Promise<void>
 * }}
 */
export const useEditorsPicks = () => {
    const [editorsPicks, setEditorsPicks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadPicks = async () => {
        setLoading(true);
        setError(null);

        try {
            const picks = await fetchEditorsPicks();
            setEditorsPicks(picks);
        } catch (err) {
            setError(err.message);
            console.error("Ошибка загрузки редакционной подборки:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- TODO(stage 2): move to react-query
        loadPicks();
    }, []);

    return {
        editorsPicks,
        loading,
        error,
        refetch: loadPicks,
    };
};
