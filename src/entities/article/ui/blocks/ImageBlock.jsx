import React from "react";

export const ImageBlock = ({ url, alt, caption }) => (
    <div className="article-image">
        <img src={url} alt={alt} />
        {caption ? <span className="image-caption">{caption}</span> : null}
    </div>
);
