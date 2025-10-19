import React from "react";

import { FileText } from "lucide-react";

const EmptyArticleWidget = () => {
    return (
        <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <FileText size={48} color="#9ca3af" style={{marginTop: "20rem"}} />
            <p
                style={{
                    maxWidth: 300,
                    textAlign: "center",
                    fontSize: "1.25rem",
                    color: "#9ca3af",
                    marginTop: "1rem",
                }}
            >
                Никакая статья пока не выбрана
            </p>
        </div>
    );
};

export default EmptyArticleWidget;
