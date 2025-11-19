import React, { useState } from 'react';
import styles from './TodoItem.module.css';

const TodoItem = ({ todo, onToggle, onDelete, onUpdate }) => {
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
      />
      
      {isEditing ? (
        <>
          <input
            className={styles.editInput}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <button
            className={`${styles.button} ${styles.saveButton}`}
            onClick={handleSave}
          >
            Сохранить
          </button>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={handleCancel}
          >
            Отмена
          </button>
        </>
      ) : (
        <>
          <span className={todo.completed ? styles.textCompleted : styles.text}>
            {todo.text}
          </span>
          <button
            className={`${styles.button} ${styles.editButton}`}
            onClick={() => setIsEditing(true)}
          >
            Редактировать
          </button>
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={() => onDelete(todo.id)}
          >
            Удалить
          </button>
        </>
      )}
    </div>
  );
};

export default TodoItem;