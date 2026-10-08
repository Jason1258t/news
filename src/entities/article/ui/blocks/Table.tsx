import { RenderHtml } from "shared/ui/render-html";
import type { ArticleTableBlock } from "../../model/types";

export const Table = ({ data, hasHeader = false }: Omit<ArticleTableBlock, "type">) => {
    if (!data || data.length === 0) return null;

    const renderCell = (content: string, index: number, isHeader = false) => {
        const CellTag = isHeader ? "th" : "td";

        return (
            <CellTag key={index}>
                <RenderHtml html={content} />
            </CellTag>
        );
    };

    const renderRow = (row: string[], rowIndex: number, isHeader = false) => (
        <tr key={rowIndex}>
            {row.map((cell, cellIndex) => renderCell(cell, cellIndex, isHeader))}
        </tr>
    );

    const headerRow = hasHeader ? data[0] : null;
    const bodyRows = hasHeader ? data.slice(1) : data;

    return (
        <div className="table-container">
            <table className="article-table">
                {hasHeader && headerRow && <thead>{renderRow(headerRow, 0, true)}</thead>}
                <tbody>
                    {bodyRows.map((row, index) => renderRow(row, hasHeader ? index + 1 : index))}
                </tbody>
            </table>
        </div>
    );
};
