import React from 'react';
import { RenderHTML } from 'shared/lib/html';

const Table = ({ data, hasHeader = false }) => {
    if (!data || data.length === 0) return null;

    const renderCell = (content, index, isHeader = false) => {
        const CellTag = isHeader ? 'th' : 'td';
        
        return (
            <CellTag key={index}>
                <RenderHTML html={content} />
            </CellTag>
        );
    };

    const renderRow = (row, rowIndex, isHeader = false) => (
        <tr key={rowIndex}>
            {row.map((cell, cellIndex) => renderCell(cell, cellIndex, isHeader))}
        </tr>
    );

    const headerRow = hasHeader ? data[0] : null;
    const bodyRows = hasHeader ? data.slice(1) : data;

    return (
        <div className="table-container">
            <table className="article-table">
                {hasHeader && headerRow && (
                    <thead>
                        {renderRow(headerRow, 0, true)}
                    </thead>
                )}
                <tbody>
                    {bodyRows.map((row, index) => 
                        renderRow(row, hasHeader ? index + 1 : index)
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;