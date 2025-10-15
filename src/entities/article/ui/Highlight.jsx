import React from 'react';

const Highlight = ({ title, content }) => (
    <div className="highlight-box">
        {title ? <h3>{title}</h3> : null}
        {content}
    </div>
);

export default Highlight;