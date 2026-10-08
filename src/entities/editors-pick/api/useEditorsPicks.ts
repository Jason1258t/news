import { useEffect, useState } from "react";
import { getErrorMessage } from "shared/lib/error";
import type { EditorsPick } from "../model/types";
import { fetchEditorsPicks } from "./editors-pick-api";

/** Редакционная подборка (только чтение). */
export const useEditorsPicks = () => {
    const [editorsPicks, setEditorsPicks] = useState<EditorsPick[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPicks = async () => {
        setLoading(true);
        setError(null);

        try {
            const picks = await fetchEditorsPicks();
            setEditorsPicks(picks);
        } catch (err) {
            setError(getErrorMessage(err));
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
