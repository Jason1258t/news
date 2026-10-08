import React from "react";

export const CharCounter = ({ length }) => {
    return (
        <span style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>Символов: {length}</span>
    );
};
