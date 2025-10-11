import React from 'react';
import { RenderHTML } from 'shared/lib/html';

const FooterNote = ({ html }) => (
    <div className="article-footer">
        <p>
            <RenderHTML html={html} />
        </p>
    </div>
);

export default FooterNote;