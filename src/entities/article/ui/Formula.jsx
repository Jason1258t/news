import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const Formula = ({ formula, display = 'inline' }) => {
    const html = katex.renderToString(formula, {
        displayMode: display === 'block',
        throwOnError: false,
        output: 'html'
    });

    if (display === 'block') {
        return (
            <div className="formula-block">
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        );
    }

    return (
        <span 
            className="formula-inline"
            dangerouslySetInnerHTML={{ __html: html }} 
        />
    );
};

export default Formula;