import { describe, expect, it } from "vitest";
import { fromFirestoreContent, toFirestoreContent } from "./firestore-content";

const table = {
    type: "table",
    hasHeader: true,
    data: [
        ["A", "B"],
        ["1", "2"],
    ],
};

describe("firestore content", () => {
    it("stores table rows as objects: Firestore rejects nested arrays", () => {
        expect(toFirestoreContent([table])).toEqual([
            {
                type: "table",
                hasHeader: true,
                data: [{ cells: ["A", "B"] }, { cells: ["1", "2"] }],
            },
        ]);
    });

    it("round-trips tables and leaves other blocks alone", () => {
        const content = [{ type: "paragraph", html: "Текст" }, table];

        expect(fromFirestoreContent(toFirestoreContent(content))).toEqual(content);
    });

    it("reads rows that are already arrays and skips broken ones", () => {
        expect(
            fromFirestoreContent([{ type: "table", data: [["x"], null, { cells: "y" }] }]),
        ).toEqual([{ type: "table", data: [["x"], [], []] }]);
    });
});
