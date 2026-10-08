/**
 * Firestore cannot store nested arrays, so a table block's rows (`string[][]` in the upload
 * format) are saved as `{ cells: string[] }` objects and turned back into arrays when read.
 * No imports: emulator/seed.ts uses this module from plain Node.
 */

interface StoredTableRow {
    cells: string[];
}

export const toFirestoreContent = <Block extends { type: string }>(content: Block[]) =>
    content.map((block) =>
        "data" in block && block.type === "table" && Array.isArray(block.data)
            ? { ...block, data: block.data.map((cells: string[]): StoredTableRow => ({ cells })) }
            : block,
    );

const toCells = (row: unknown): string[] => {
    if (Array.isArray(row)) return row;
    const cells = (row as Partial<StoredTableRow> | null)?.cells;
    return Array.isArray(cells) ? cells : [];
};

export const fromFirestoreContent = <Block extends { type: string }>(content: Block[]) =>
    content.map((block) =>
        "data" in block && block.type === "table" && Array.isArray(block.data)
            ? { ...block, data: block.data.map(toCells) }
            : block,
    );
