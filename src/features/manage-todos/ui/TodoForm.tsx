import { useState } from "react";
import { Button } from "shared/ui/button";
import styles from "./TodoForm.module.css";

export const TodoForm = ({ onAdd }: { onAdd: (text: string) => void }) => {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (text.trim()) {
            onAdd(text.trim());
            setText("");
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <div className={styles.container}>
                <input
                    className={styles.input}
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Добавить новую задачу..."
                    aria-label="Новая задача"
                />
                <Button type="submit">Добавить</Button>
            </div>
        </form>
    );
};
