import React from 'react';
import { RenderHTML } from 'shared/lib/html';

const Heading = ({ level, text }) => {
    const Tag = `h${level}`;
    return (
        <Tag>
            <RenderHTML html={text} />
        </Tag>
    );
};

export default Heading;