import { describe, expect, it } from "vitest";
import { z } from "zod";
import { printSchemaTypes } from "./print-schema-types";

describe("printSchemaTypes", () => {
    it("prints primitives, optional fields, literals, enums and descriptions", () => {
        const schema = z
            .object({
                name: z.string().describe("Имя"),
                age: z.number().optional(),
                active: z.boolean(),
                kind: z.literal("user"),
                level: z.union([z.literal(1), z.literal(2)]),
                role: z.enum(["admin", "editor"]),
            })
            .meta({ id: "PrintTestUser", description: "Пользователь" });

        expect(printSchemaTypes(schema)).toBe(
            [
                "/** Пользователь */",
                "type PrintTestUser = {",
                "    /** Имя */",
                "    name: string;",
                "    age?: number;",
                "    active: boolean;",
                '    kind: "user";',
                "    level: 1 | 2;",
                '    role: "admin" | "editor";',
                "};",
            ].join("\n"),
        );
    });

    it("prints arrays, nested objects and constraints", () => {
        const schema = z.object({
            tags: z.array(z.string()).min(1),
            matrix: z.array(z.array(z.string())),
            modes: z.array(z.enum(["a", "b"])),
            nested: z.object({ x: z.number() }),
        });

        expect(printSchemaTypes(schema, { rootName: "Shape" })).toBe(
            [
                "type Shape = {",
                "    /** минимум 1 */",
                "    tags: string[];",
                "    matrix: string[][];",
                '    modes: ("a" | "b")[];',
                "    nested: {",
                "        x: number;",
                "    };",
                "};",
            ].join("\n"),
        );
    });

    it("declares named sub-schemas once, in reference order", () => {
        const text = z
            .object({ type: z.literal("text"), value: z.string() })
            .meta({ id: "PrintTestText" });
        const image = z
            .object({ type: z.literal("image"), url: z.string() })
            .meta({ id: "PrintTestImage", description: "Картинка" });
        const block = z.discriminatedUnion("type", [text, image]).meta({ id: "PrintTestBlock" });
        const doc = z.object({ main: block, extra: z.array(block), cover: image });

        expect(printSchemaTypes(doc, { rootName: "Doc" })).toBe(
            [
                "type Doc = {",
                "    main: PrintTestBlock;",
                "    extra: PrintTestBlock[];",
                "    cover: PrintTestImage;",
                "};",
                "",
                "type PrintTestBlock = PrintTestText | PrintTestImage;",
                "",
                "/** Картинка */",
                "type PrintTestImage = {",
                '    type: "image";',
                "    url: string;",
                "};",
                "",
                "type PrintTestText = {",
                '    type: "text";',
                "    value: string;",
                "};",
            ].join("\n"),
        );
    });

    it("uses the item description for arrays", () => {
        const schema = z.object({ items: z.array(z.string().describe("HTML")) });
        expect(printSchemaTypes(schema, { rootName: "List" })).toContain(
            "    /** HTML */\n    items: string[];",
        );
    });

    it("breaks long top-level unions into lines", () => {
        const variants = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel"];
        const schema = z.enum(variants as [string, ...string[]]);
        expect(printSchemaTypes(schema, { rootName: "Letter" })).toBe(
            ["type Letter =", ...variants.map((v) => `    | "${v}"`)].join("\n") + ";",
        );
    });

    it("falls back to Root without a name", () => {
        expect(printSchemaTypes(z.object({ a: z.string() }))).toMatch(/^type Root = \{/);
    });
});
