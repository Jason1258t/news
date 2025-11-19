import React, { useState } from "react";
import styles from "./TodoForm.module.css";
import FilledButton from "widgets/buttons/FilledButton";

const TodoForm = ({ onAdd }) => {
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
        />
        <FilledButton onClick={handleSubmit}>
          Добавить
        </FilledButton>
      </div>
    </form>
  );
};

export default TodoForm;
