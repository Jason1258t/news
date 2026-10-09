import type { HTMLAttributes, KeyboardEvent } from "react";

/**
 * Props that make a non-button element (e.g. a card with headings inside, which a <button>
 * may not contain) behave like a button: focusable, announced as a button, Enter/Space click.
 */
export const clickableProps = (onClick: () => void): HTMLAttributes<HTMLElement> => ({
    role: "button",
    tabIndex: 0,
    onClick,
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
        }
    },
});
