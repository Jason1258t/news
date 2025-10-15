import React from 'react';
import { RenderHTML } from 'shared/lib/html';

const List = ({ items }) => (
    <ul>
        {items.map((it, idx) => (
            <li key={idx}>
                <RenderHTML html={it} />
            </li>
        ))}
    </ul>
);

export default List;