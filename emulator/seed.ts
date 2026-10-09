/**
 * Resets the local Firebase emulators and fills them with seed-data.ts.
 * CLI: `node emulator/run-seed.ts`; tests import seedEmulators directly.
 * Talks to the emulators' REST APIs with the "owner" token, which bypasses security rules.
 */
import { SEED_ADMIN, seedArticles, seedEditorsPicks, seedTodos } from "./seed-data.ts";
import { toFirestoreContent } from "../src/entities/article/model/firestore-content.ts";

export const PROJECT_ID = "demo-news";
const FIRESTORE = "http://127.0.0.1:8085";
const AUTH = "http://127.0.0.1:9099";
const OWNER = { Authorization: "Bearer owner", "Content-Type": "application/json" };
const DOCUMENTS = `${FIRESTORE}/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const request = async (url: string, init: RequestInit) => {
    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(`${init.method} ${url}: ${response.status} ${await response.text()}`);
    }
    return response;
};

type FirestoreValue = Record<string, unknown>;

/** JS value → Firestore REST value. */
const toValue = (value: unknown): FirestoreValue => {
    if (value === null || value === undefined) return { nullValue: null };
    if (value instanceof Date) return { timestampValue: value.toISOString() };
    if (typeof value === "string") return { stringValue: value };
    if (typeof value === "boolean") return { booleanValue: value };
    if (typeof value === "number") {
        return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
    }
    if (Array.isArray(value)) return { arrayValue: { values: value.map(toValue) } };
    return { mapValue: { fields: toFields(value as Record<string, unknown>) } };
};

const toFields = (data: Record<string, unknown>) =>
    Object.fromEntries(
        Object.entries(data)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => [key, toValue(value)]),
    );

export const putDoc = (collection: string, id: string, data: Record<string, unknown>) =>
    request(`${DOCUMENTS}/${collection}/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: OWNER,
        body: JSON.stringify({ fields: toFields(data) }),
    });

export const clearFirestore = () =>
    request(`${FIRESTORE}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`, {
        method: "DELETE",
        headers: OWNER,
    });

export const clearAuth = () =>
    request(`${AUTH}/emulator/v1/projects/${PROJECT_ID}/accounts`, {
        method: "DELETE",
        headers: OWNER,
    });

/** Creates an Auth emulator account with the admin custom claim; returns its uid. */
export const createAdmin = async ({ email, password } = SEED_ADMIN) => {
    const identity = `${AUTH}/identitytoolkit.googleapis.com/v1`;
    const signUp = await request(`${identity}/projects/${PROJECT_ID}/accounts`, {
        method: "POST",
        headers: OWNER,
        body: JSON.stringify({ email, password }),
    });
    const { localId } = (await signUp.json()) as { localId: string };
    await request(`${identity}/projects/${PROJECT_ID}/accounts:update`, {
        method: "POST",
        headers: OWNER,
        body: JSON.stringify({ localId, customAttributes: JSON.stringify({ admin: true }) }),
    });
    return localId;
};

export const seedEmulators = async () => {
    await Promise.all([clearFirestore(), clearAuth()]);

    const createdAt = new Date(Date.UTC(2026, 0, 1));
    await Promise.all([
        createAdmin(),
        ...seedArticles.map((article) =>
            putDoc("articles", article.slug, {
                ...article,
                content: toFirestoreContent(article.content),
                createdAt,
                updatedAt: createdAt,
            }),
        ),
        ...seedEditorsPicks.map(({ id, ...pick }) =>
            putDoc("editors-pick", id, { ...pick, createdAt, updatedAt: createdAt }),
        ),
        ...seedTodos.map(({ id, ...todo }) => putDoc("todos", id, { ...todo, createdAt })),
    ]);
};
