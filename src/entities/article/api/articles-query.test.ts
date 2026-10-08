import { beforeEach, describe, expect, it, vi } from "vitest";
import { getArticlesQuery, needsClientCategoryFilter } from "./articles-query";

interface FakeQuery {
    ref: unknown;
    constraints: Array<{ kind: string } & Record<string, unknown>>;
}

// The real return type is a Firestore Query; with firestore mocked it is our plain FakeQuery.
const buildQuery = (...args: Parameters<typeof getArticlesQuery>) =>
    getArticlesQuery(...args) as unknown as FakeQuery;

vi.mock("shared/api/firebase", () => ({ db: { __db: true } }));

// Each constraint helper returns a plain tagged object, so we can assert on the query shape.
vi.mock("firebase/firestore", () => ({
    collection: vi.fn((db: unknown, path: string) => ({ kind: "collection", db, path })),
    query: vi.fn((ref: unknown, ...constraints: unknown[]) => ({ ref, constraints })),
    orderBy: vi.fn((field: string, dir: string) => ({ kind: "orderBy", field, dir })),
    where: vi.fn((field: string, op: string, value: unknown) => ({
        kind: "where",
        field,
        op,
        value,
    })),
    limit: vi.fn((n: number) => ({ kind: "limit", n })),
    startAfter: vi.fn((cursor: unknown) => ({ kind: "startAfter", cursor })),
}));

describe("getArticlesQuery", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("orders by publish date and applies the default page size", () => {
        expect(buildQuery()).toEqual({
            ref: { kind: "collection", db: { __db: true }, path: "articles" },
            constraints: [
                { kind: "orderBy", field: "datePublishedISO", dir: "desc" },
                { kind: "limit", n: 5 },
            ],
        });
    });

    it("filters by category", () => {
        const { constraints } = buildQuery("Наука", undefined, 10);
        expect(constraints).toEqual([
            { kind: "orderBy", field: "datePublishedISO", dir: "desc" },
            { kind: "where", field: "category", op: "array-contains", value: "Наука" },
            { kind: "limit", n: 10 },
        ]);
    });

    it("filters by any of the tags", () => {
        const { constraints } = buildQuery(null, ["a", "b"]);
        expect(constraints).toContainEqual({
            kind: "where",
            field: "tags",
            op: "array-contains-any",
            value: ["a", "b"],
        });
    });

    it("ignores an empty tag list", () => {
        const { constraints } = buildQuery(null, []);
        expect(constraints.some((c) => c.kind === "where")).toBe(false);
    });

    it("continues after the cursor document, before the limit", () => {
        const cursor = { id: "last" };
        const { constraints } = buildQuery(null, undefined, 5, cursor as never);
        expect(constraints.slice(-2)).toEqual([
            { kind: "startAfter", cursor },
            { kind: "limit", n: 5 },
        ]);
    });

    it("leaves the category to the client when tags are set too (B15)", () => {
        const { constraints } = buildQuery("Наука", ["a"]);
        const wheres = constraints.filter((c) => c.kind === "where");
        expect(wheres).toEqual([
            { kind: "where", field: "tags", op: "array-contains-any", value: ["a"] },
        ]);
    });
});

describe("needsClientCategoryFilter", () => {
    it.each([
        ["Наука", ["a"], true],
        ["Наука", [], false],
        ["Наука", undefined, false],
        [null, ["a"], false],
    ] as const)("category %j, tags %j → %s", (category, tags, expected) => {
        expect(needsClientCategoryFilter(category, tags ? [...tags] : undefined)).toBe(expected);
    });
});
