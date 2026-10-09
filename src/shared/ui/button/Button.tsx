import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

/**
 * primary — main action; secondary — outlined accent; danger — destructive, soft red;
 * ghost — quiet action next to content (edit, logout).
 */
export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

/** Основная кнопка проекта. По умолчанию type="button", чтобы случайно не отправлять формы. */
export const Button = ({
    variant = "primary",
    size = "md",
    type = "button",
    className = "",
    ...props
}: ButtonProps) => (
    <button
        type={type}
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`.trim()}
        {...props}
    />
);
