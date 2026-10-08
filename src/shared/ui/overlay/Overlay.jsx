import React from "react";

const Overlay = ({ children }) => {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "1rem",
            }}
        >
            {children}
        </div>
    );
};

export default Overlay;
