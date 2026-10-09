import { z } from "zod";
import { articleInputSchema } from "./schema";
import type { ArticleInput } from "./types";

const MAX_REPORTED_ISSUES = 5;
const ruErrors = z.locales.ru().localeError;

/** LLMs write `"field": null` for absent optional fields; treat it as absent. */
export const stripNulls = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(stripNulls);
    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value)
                .filter(([, item]) => item !== null)
                .map(([key, item]) => [key, stripNulls(item)]),
        );
    }
    return value;
};

const formatPath = (path: PropertyKey[]) =>
    path.reduce<string>(
        (result, key) =>
            typeof key === "number"
                ? `${result}[${key}]`
                : result
                  ? `${result}.${String(key)}`
                  : String(key),
        "",
    );

/**
 * Validates article JSON pasted in the admin panel against the article schema.
 * Returns the parsed article (unknown fields dropped) or throws an Error whose
 * message lists the problems in Russian, e.g. "content[3].type: …".
 */
export const parseArticleInput = (data: unknown): ArticleInput => {
    const result = articleInputSchema.safeParse(stripNulls(data), { error: ruErrors });
    if (result.success) return result.data;

    const issues = result.error.issues;
    const lines = issues
        .slice(0, MAX_REPORTED_ISSUES)
        .map((issue) => `${formatPath(issue.path) || "статья"}: ${issue.message}`);
    if (issues.length > MAX_REPORTED_ISSUES) {
        lines.push(`…и ещё ${issues.length - MAX_REPORTED_ISSUES}`);
    }
    throw new Error(`Статья не соответствует формату:\n${lines.join("\n")}`);
};
