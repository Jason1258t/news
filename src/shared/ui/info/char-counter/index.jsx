import React from "react";

const CharCounter = ({ length }) => {
    return (
        <span style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>
            Символов: {length}
        </span>
    );
};

export default CharCounter;
