import Linkify from "linkify-react";
import { useState } from "react";
import type { Todo } from "entities/todo";
import { Button } from "shared/ui/button";
import styles from "./TodoItem.module.css";

export interface TodoActions {
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, text: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete, onUpdate }: { todo: Todo } & TodoActions) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleSave = () => {
        if (editText.trim() && editText !== todo.text) {
            onUpdate(todo.id, editText.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(todo.text);
        setIsEditing(false);
    };

    return (
        <div className={styles.item}>
            <input
                className={styles.checkbox}
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id, todo.completed)}
                aria-label={todo.text}
            />

            {isEditing ? (
                <>
                    <input
                        className={styles.editInput}
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") handleCancel();
                        }}
                        aria-label="Текст задачи"
                        autoFocus
                    />
                    <Button size="sm" onClick={handleSave}>
                        Сохранить
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancel}>
                        Отмена
                    </Button>
                </>
            ) : (
                <>
                    <span className={todo.completed ? styles.textCompleted : styles.text}>
                        <Linkify options={{ target: "_blank", rel: "noopener noreferrer" }}>
                            {todo.text}
                        </Linkify>
                    </span>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                        aria-label={`Редактировать: ${todo.text}`}
                    >
                        Редактировать
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDelete(todo.id)}
                        aria-label={`Удалить: ${todo.text}`}
                    >
                        Удалить
                    </Button>
                </>
            )}
        </div>
    );
};
