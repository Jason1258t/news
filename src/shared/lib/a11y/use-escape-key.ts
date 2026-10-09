import { useEffect } from "react";

/** Calls `onEscape` when Escape is pressed while `enabled` (e.g. while a dialog is open). */
export const useEscapeKey = (onEscape: () => void, enabled = true) => {
    useEffect(() => {
        if (!enabled) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onEscape();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onEscape, enabled]);
};
