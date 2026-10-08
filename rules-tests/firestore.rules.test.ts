import { readFileSync } from "node:fs";
import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { deleteDoc, doc, getDoc, setDoc, type Firestore } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

// Runs against the Firestore emulator: npm run test:emulator
let env: RulesTestEnvironment;

beforeAll(async () => {
    env = await initializeTestEnvironment({
        projectId: "demo-news",
        firestore: { rules: readFileSync("firestore.rules", "utf8") },
    });
});

afterAll(async () => {
    await env?.cleanup();
});

beforeEach(async () => {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        for (const collection of ["articles", "editors-pick", "horoscopes", "todos", "other"]) {
            await setDoc(doc(db, collection, "existing"), { title: "seed" });
        }
    });
});

type Role = "guest" | "user" | "admin";

const db = (role: Role): Firestore => {
    if (role === "guest") return env.unauthenticatedContext().firestore() as unknown as Firestore;
    if (role === "user")
        return env.authenticatedContext("user").firestore() as unknown as Firestore;
    return env.authenticatedContext("admin", { admin: true }).firestore() as unknown as Firestore;
};

const read = (role: Role, collection: string) => getDoc(doc(db(role), collection, "existing"));
const create = (role: Role, collection: string) =>
    setDoc(doc(db(role), collection, "new"), { title: "new" });
const update = (role: Role, collection: string) =>
    setDoc(doc(db(role), collection, "existing"), { title: "changed" });
const remove = (role: Role, collection: string) => deleteDoc(doc(db(role), collection, "existing"));

describe.each(["articles", "editors-pick", "horoscopes"])("public collection %s", (collection) => {
    it.each<Role>(["guest", "user", "admin"])("%s can read", async (role) => {
        await assertSucceeds(read(role, collection));
    });

    it.each<Role>(["guest", "user"])("%s cannot write", async (role) => {
        await assertFails(create(role, collection));
        await assertFails(update(role, collection));
        await assertFails(remove(role, collection));
    });

    it("admin can write", async () => {
        await assertSucceeds(create("admin", collection));
        await assertSucceeds(update("admin", collection));
        await assertSucceeds(remove("admin", collection));
    });
});

describe("todos (studio)", () => {
    it.each<Role>(["guest", "user"])("%s can neither read nor write", async (role) => {
        await assertFails(read(role, "todos"));
        await assertFails(create(role, "todos"));
        await assertFails(update(role, "todos"));
        await assertFails(remove(role, "todos"));
    });

    it("admin can read and write", async () => {
        await assertSucceeds(read("admin", "todos"));
        await assertSucceeds(create("admin", "todos"));
        await assertSucceeds(update("admin", "todos"));
        await assertSucceeds(remove("admin", "todos"));
    });
});

describe("collections without rules", () => {
    it("are closed even for admins", async () => {
        await assertFails(read("admin", "other"));
        await assertFails(create("admin", "other"));
    });
});
