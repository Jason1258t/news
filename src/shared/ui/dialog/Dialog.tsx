import { useEffect, useRef, type ReactNode } from "react";
import { useEscapeKey } from "shared/lib/a11y";
import styles from "./Dialog.module.css";

interface DialogProps {
    /** ID of the element with the dialog title. */
    labelledBy: string;
    /** Escape key; the dialog itself has no close button, callers render their own. */
    onClose: () => void;
    className?: string;
    children: ReactNode;
}

/** Modal dialog over a dimmed backdrop. Takes focus when it opens and closes on Escape. */
export const Dialog = ({ labelledBy, onClose, className, children }: DialogProps) => {
    const panelRef = useRef<HTMLDivElement>(null);
    useEscapeKey(onClose);

    useEffect(() => {
        panelRef.current?.focus();
    }, []);

    return (
        <div className={styles.overlay}>
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={labelledBy}
                tabIndex={-1}
                className={`${styles.panel} ${className ?? ""}`.trim()}
            >
                {children}
            </div>
        </div>
    );
};
