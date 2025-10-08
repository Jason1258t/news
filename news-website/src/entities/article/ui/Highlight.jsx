import React from 'react';
import { RenderHTML } from 'shared/lib/html';

const Highlight = ({ title, content }) => (
    <div className="highlight-box">
        {title ? <h3>{title}</h3> : null}
        <p>
            <RenderHTML html={content} />
        </p>
    </div>
);

export default Highlight;