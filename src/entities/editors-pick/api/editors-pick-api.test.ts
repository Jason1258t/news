import { doc, getDocs, writeBatch } from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeQuerySnapshot } from "../../../test/firestore";
import type { EditorsPickInput } from "../model/types";
import { replaceEditorsPicks } from "./editors-pick-api";

const batch = { delete: vi.fn(), set: vi.fn(), commit: vi.fn() };

vi.mock("firebase/firestore", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    collection: vi.fn(() => ({})),
    query: vi.fn(() => ({})),
    getDocs: vi.fn(),
    doc: vi.fn((_db: unknown, collection: string, id: string) => ({ path: `${collection}/${id}` })),
    writeBatch: vi.fn(() => batch),
    serverTimestamp: vi.fn(() => "ts"),
}));

const existing = (id: string) => ({ id, ref: { path: `editors-pick/${id}` } });
const pick = (title: string): EditorsPickInput => ({
    title,
    badge: "Must Read",
    articleUrl: `https://site/#/articles/${title}`,
});

describe("replaceEditorsPicks", () => {
    beforeEach(() => {
        Object.values(batch).forEach((fn) => fn.mockReset());
        vi.mocked(getDocs).mockResolvedValue(
            fakeQuerySnapshot([existing("old-1"), existing("old-2")] as never),
        );
    });

    it("deletes the old picks and writes the new ones in a single batch (B7)", async () => {
        await replaceEditorsPicks([pick("a"), pick("b")]);

        expect(writeBatch).toHaveBeenCalledTimes(1);
        expect(batch.delete.mock.calls.map(([ref]) => ref.path)).toEqual([
            "editors-pick/old-1",
            "editors-pick/old-2",
        ]);
        expect(batch.set.mock.calls.map(([, data]) => data.title)).toEqual(["a", "b"]);
        expect(batch.commit).toHaveBeenCalledTimes(1);
    });

    it("gives the new documents ids that sort in the editor's order", async () => {
        const titles = Array.from({ length: 12 }, (_, i) => `t${i}`);
        await replaceEditorsPicks(titles.map(pick));

        const ids = vi.mocked(doc).mock.calls.map(([, , id]) => id as string);
        expect([...ids].sort()).toEqual(ids);
    });

    it("writes nothing when a pick is invalid", async () => {
        await expect(
            replaceEditorsPicks([pick("a"), { ...pick("b"), title: " " }]),
        ).rejects.toThrow("Запись 2");
        expect(batch.commit).not.toHaveBeenCalled();
    });

    it("leaves the stored picks untouched when the commit fails", async () => {
        batch.commit.mockRejectedValue(new Error("permission-denied"));
        await expect(replaceEditorsPicks([pick("a")])).rejects.toThrow("permission-denied");
        // deletes and writes are only staged in the batch, nothing was applied separately
        expect(batch.delete).toHaveBeenCalled();
    });
});
