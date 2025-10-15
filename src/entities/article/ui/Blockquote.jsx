import React from 'react';
import { RenderHTML } from 'shared/lib/html';

const Blockquote = ({ html, footer, variant }) => (
    <blockquote
        className={`quote${
            variant && variant !== "default" ? ` ${variant}` : ""
        }`}
    >
        <p>
            <RenderHTML html={html} />
        </p>
        {footer ? (
            <footer>
                <RenderHTML html={footer} />
            </footer>
        ) : null}
    </blockquote>
);

export default Blockquote;