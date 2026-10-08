import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

/** Основная кнопка проекта. По умолчанию type="button", чтобы случайно не отправлять формы. */
export const Button = ({
    variant = "primary",
    type = "button",
    className = "",
    ...props
}: ButtonProps) => (
    <button
        type={type}
        className={`${styles.button} ${styles[variant]} ${className}`.trim()}
        {...props}
    />
);
