import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

const CodeBlock = ({ code, language = 'text', filename }) => {
    const codeRef = useRef(null);

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [code, language]);

    return (
        <div className="code-block">
            {filename && (
                <div className="code-filename">
                    {filename}
                </div>
            )}
            <pre className={language !== 'text' ? `language-${language}` : ''}>
                <code ref={codeRef} className={language !== 'text' ? `language-${language}` : ''}>
                    {code}
                </code>
            </pre>
        </div>
    );
};

export default CodeBlock;