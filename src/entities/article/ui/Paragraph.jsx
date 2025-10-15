import React from 'react';
import { RenderHTML } from 'shared/lib/html';

const Paragraph = ({ html }) => (
    <p>
        <RenderHTML html={html} />
    </p>
);

export default Paragraph;