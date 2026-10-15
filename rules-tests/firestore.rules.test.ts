import { readFileSync } from "node:fs";
import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
    deleteDoc,
    doc,
    getDoc,
    increment,
    setDoc,
    updateDoc,
    type Firestore,
} from "firebase/firestore";
import { getStatsDay } from "../src/entities/site-stats/model/stats-day";
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

describe("stats (analytics counters)", () => {
    const today = getStatsDay();
    const stats = (role: Role, day = today) => doc(db(role), "stats", day);
    const view = (role: Role, slug: string, day = today) =>
        setDoc(
            stats(role, day),
            { articles: { [slug]: increment(1) }, lastArticle: slug },
            { merge: true },
        );

    beforeEach(async () => {
        await env.withSecurityRulesDisabled(async (context) => {
            const admin = context.firestore();
            await setDoc(doc(admin, "articles", "real-article"), { title: "seed" });
            await setDoc(doc(admin, "stats", today), {
                visits: 5,
                articles: { "real-article": 2 },
            });
        });
    });

    it.each<Role>(["guest", "user"])("%s can add a visit and an article view", async (role) => {
        await assertSucceeds(updateDoc(stats(role), { visits: increment(1) }));
        await assertSucceeds(view(role, "real-article"));
    });

    it("a guest can start a new day", async () => {
        await env.withSecurityRulesDisabled((context) =>
            deleteDoc(doc(context.firestore(), "stats", today)),
        );
        await assertSucceeds(setDoc(stats("guest"), { visits: increment(1) }, { merge: true }));
        await assertSucceeds(view("guest", "real-article"));
    });

    it("a guest cannot add more than one or reset counters", async () => {
        await assertFails(updateDoc(stats("guest"), { visits: increment(2) }));
        await assertFails(updateDoc(stats("guest"), { visits: 0 }));
        await assertFails(
            updateDoc(stats("guest"), { visits: increment(1), "articles.real-article": 3 }),
        );
        await assertFails(updateDoc(stats("guest"), { "articles.real-article": 1 }));
    });

    it("a guest cannot touch other fields, other days or delete", async () => {
        await assertFails(setDoc(stats("guest"), { hacked: true }, { merge: true }));
        await assertFails(
            setDoc(stats("guest", "2020-01-01"), { visits: increment(1) }, { merge: true }),
        );
        await assertFails(
            setDoc(stats("guest", "not-a-day"), { visits: increment(1) }, { merge: true }),
        );
        await assertFails(deleteDoc(stats("guest")));
    });

    it("a guest can only count articles that exist", async () => {
        await assertFails(
            setDoc(
                stats("guest"),
                { articles: { "no-such-article": increment(1) } },
                { merge: true },
            ),
        );
        await assertFails(
            setDoc(
                stats("guest"),
                { articles: { "real-article": increment(1), other: increment(1) } },
                { merge: true },
            ),
        );
    });

    it("only an admin can read", async () => {
        await assertFails(getDoc(stats("guest")));
        await assertFails(getDoc(stats("user")));
        await assertSucceeds(getDoc(stats("admin")));
    });
});

describe("collections without rules", () => {
    it("are closed even for admins", async () => {
        await assertFails(read("admin", "other"));
        await assertFails(create("admin", "other"));
    });
});
