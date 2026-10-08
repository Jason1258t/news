import { z } from "zod";

/** Subset of JSON Schema that z.toJSONSchema produces for the schemas we print. */
interface JsonSchema {
    $ref?: string;
    type?: string | string[];
    const?: unknown;
    enum?: unknown[];
    anyOf?: JsonSchema[];
    oneOf?: JsonSchema[];
    items?: JsonSchema;
    properties?: Record<string, JsonSchema>;
    required?: string[];
    description?: string;
    minItems?: number;
    $defs?: Record<string, JsonSchema>;
}

const INDENT = "    ";
const MAX_LINE = 80;

const refName = (ref: string) => ref.replace("#/$defs/", "");

const jsDoc = (text: string | undefined, indent: string) =>
    text ? `${indent}/** ${text} */\n` : "";

const describe = (schema: JsonSchema) => {
    // Arrays of described items (e.g. z.array(z.string().describe(...))) inherit the item description.
    const description = schema.description ?? schema.items?.description;
    const notes = [description, schema.minItems ? `минимум ${schema.minItems}` : undefined];
    const text = notes.filter(Boolean).join("; ");
    return text || undefined;
};

/** Renders a JSON Schema node as a TypeScript type expression. */
const printType = (schema: JsonSchema, indent: string, refs: string[]): string => {
    if (schema.$ref) {
        const name = refName(schema.$ref);
        if (!refs.includes(name)) refs.push(name);
        return name;
    }
    if (schema.const !== undefined) return JSON.stringify(schema.const);
    if (schema.enum) return schema.enum.map((value) => JSON.stringify(value)).join(" | ");

    const variants = schema.oneOf ?? schema.anyOf;
    if (variants) {
        return [...new Set(variants.map((variant) => printType(variant, indent, refs)))].join(
            " | ",
        );
    }

    switch (schema.type) {
        case "string":
            return "string";
        case "number":
        case "integer":
            return "number";
        case "boolean":
            return "boolean";
        case "null":
            return "null";
        case "array": {
            const item = schema.items ? printType(schema.items, indent, refs) : "unknown";
            return item.includes(" | ") ? `(${item})[]` : `${item}[]`;
        }
        case "object":
            return printObject(schema, indent, refs);
        default:
            return "unknown";
    }
};

const printObject = (schema: JsonSchema, indent: string, refs: string[]): string => {
    const entries = Object.entries(schema.properties ?? {});
    if (entries.length === 0) return "Record<string, unknown>";

    const inner = indent + INDENT;
    const required = new Set(schema.required ?? []);
    const lines = entries.map(([key, property]) => {
        const optional = required.has(key) ? "" : "?";
        const type = printType(property, inner, refs);
        return `${jsDoc(describe(property), inner)}${inner}${key}${optional}: ${type};`;
    });
    return `{\n${lines.join("\n")}\n${indent}}`;
};

export interface PrintSchemaTypesOptions {
    /** Name of the root type; defaults to the schema's meta id. */
    rootName?: string;
}

/**
 * Prints a zod schema as TypeScript type declarations: the root type first, then every
 * named sub-schema (registered with `.meta({ id })`) in the order it is first referenced.
 * Descriptions from `.describe()` / `.meta({ description })` become JSDoc comments.
 */
export const printSchemaTypes = (schema: z.ZodType, options: PrintSchemaTypesOptions = {}) => {
    const json = z.toJSONSchema(schema, { unrepresentable: "any" }) as JsonSchema;
    const defs = json.$defs ?? {};
    const rootName = options.rootName ?? (json.$ref ? refName(json.$ref) : undefined) ?? "Root";

    const declarations: string[] = [];
    const refs: string[] = [];
    const declare = (name: string, node: JsonSchema) => {
        let type = printType(node, "", refs);
        // Break long top-level unions one variant per line, like Prettier does.
        if (type.includes(" | ") && !type.includes("\n") && type.length + name.length > MAX_LINE) {
            type = type
                .split(" | ")
                .map((variant) => `\n${INDENT}| ${variant}`)
                .join("");
        }
        declarations.push(
            `${jsDoc(describe(node), "")}type ${name} =${type.startsWith("\n") ? "" : " "}${type};`,
        );
    };

    // A root registered with an id is emitted as a $ref to its own definition.
    const root = json.$ref ? defs[refName(json.$ref)] : json;
    if (!root) throw new Error(`Schema references unknown definition "${json.$ref}"`);
    declare(rootName, root);
    // `refs` grows while we print, so this walks the reference graph breadth-first.
    for (let i = 0; i < refs.length; i++) {
        const name = refs[i]!;
        if (name === rootName) continue;
        const node = defs[name];
        if (!node) throw new Error(`Schema references unknown definition "${name}"`);
        declare(name, node);
    }

    return declarations.join("\n\n");
};
