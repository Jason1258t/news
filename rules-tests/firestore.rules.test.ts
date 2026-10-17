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
    writeBatch,
    type Firestore,
} from "firebase/firestore";
import { getStatsDay } from "../src/shared/lib/date/stats-day";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

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

describe("likes", () => {
    const fs = (uid: string) => env.authenticatedContext(uid).firestore() as unknown as Firestore;
    const likes = (db: Firestore, slug = "real-article") => doc(db, "likes", slug);
    const voter = (db: Firestore, uid: string, slug = "real-article") =>
        doc(db, "likes", slug, "voters", uid);
    const today = getStatsDay();
    const dayLikes = (db: Firestore, slug: string, by = 1) =>
        [doc(db, "stats", today), { likes: increment(by), lastLiked: slug }] as const;
    const toggle = (uid: string, liked: boolean, { slug = "real-article", by = 1 } = {}) => {
        const db = fs(uid);
        const batch = writeBatch(db);
        if (liked) batch.set(voter(db, uid, slug), {});
        else batch.delete(voter(db, uid, slug));
        batch.set(...dayLikes(db, slug, liked ? by : -by), { merge: true });
        batch.set(likes(db, slug), { count: increment(liked ? by : -by) }, { merge: true });
        return batch.commit();
    };

    beforeEach(async () => {
        await env.withSecurityRulesDisabled(async (context) => {
            const admin = context.firestore();
            await setDoc(doc(admin, "articles", "real-article"), { title: "seed" });
            await setDoc(doc(admin, "articles", "fresh-article"), { title: "seed" });
            await setDoc(doc(admin, "likes", "real-article"), { count: 3 });
            await setDoc(doc(admin, "likes", "real-article", "voters", "old-fan"), {});
        });
    });

    it("anyone reads the count, a voter reads only their own vote", async () => {
        await assertSucceeds(getDoc(likes(db("guest"))));
        await assertSucceeds(getDoc(voter(fs("old-fan"), "old-fan")));
        await assertFails(getDoc(voter(fs("someone"), "old-fan")));
        await assertFails(getDoc(voter(db("guest"), "old-fan")));
    });

    it("a reader likes once and can take the like back", async () => {
        await assertSucceeds(toggle("reader", true));
        await assertFails(toggle("reader", true));
        await assertSucceeds(toggle("reader", false));
        await assertFails(toggle("reader", false));
        await assertSucceeds(toggle("reader", true));
    });

    it("the first like creates the counter", async () => {
        await assertSucceeds(toggle("reader", true, { slug: "fresh-article" }));
    });

    it("a guest without a uid cannot like", async () => {
        const guest = db("guest");
        const batch = writeBatch(guest);
        batch.set(likes(guest), { count: increment(1) }, { merge: true });
        await assertFails(batch.commit());
    });

    it("the counter and the vote change only together, by one", async () => {
        await assertFails(toggle("reader", true, { by: 2 }));
        await assertFails(updateDoc(likes(fs("reader")), { count: increment(1) }));
        await assertFails(setDoc(voter(fs("reader"), "reader"), {}));
        await assertFails(updateDoc(likes(fs("reader")), { count: 0 }));
        await assertFails(deleteDoc(likes(fs("reader"))));
    });

    it("a reader cannot vote or unvote for someone else", async () => {
        const db = fs("reader");
        const unlikeOther = writeBatch(db);
        unlikeOther.delete(voter(db, "old-fan"));
        unlikeOther.set(likes(db), { count: increment(-1) }, { merge: true });
        await assertFails(unlikeOther.commit());

        const likeAsOther = writeBatch(db);
        likeAsOther.set(voter(db, "ghost"), {});
        likeAsOther.set(likes(db), { count: increment(1) }, { merge: true });
        await assertFails(likeAsOther.commit());
    });

    it("today's likes move by one, and only together with the like itself", async () => {
        const todayLikes = async () => {
            let likes: unknown;
            await env.withSecurityRulesDisabled(async (context) => {
                likes = (await getDoc(doc(context.firestore(), "stats", today))).data()?.likes;
            });
            return likes;
        };
        await assertSucceeds(toggle("reader", true));
        await assertSucceeds(toggle("reader", false));
        await assertSucceeds(toggle("reader", true));
        expect(await todayLikes()).toBe(1);
        // A like from before today can be taken back: today goes below zero.
        await assertSucceeds(toggle("old-fan", false));
        expect(await todayLikes()).toBe(0);

        // Without a new vote in the same batch: already liked, or no vote at all.
        const reader = fs("reader");
        await assertFails(setDoc(...dayLikes(reader, "real-article"), { merge: true }));
        await assertFails(setDoc(...dayLikes(fs("someone"), "real-article"), { merge: true }));

        // Taking back a like that was never given.
        await assertFails(setDoc(...dayLikes(fs("someone"), "real-article", -1), { merge: true }));

        // More than one per like.
        const other = fs("other");
        const batch = writeBatch(other);
        batch.set(voter(other, "other"), {});
        batch.set(likes(other), { count: increment(1) }, { merge: true });
        batch.set(...dayLikes(other, "real-article", 2), { merge: true });
        await assertFails(batch.commit());
    });

    it("rejects missing articles and extra fields", async () => {
        await assertFails(toggle("reader", true, { slug: "no-such-article" }));
        const db = fs("reader");
        const batch = writeBatch(db);
        batch.set(voter(db, "reader"), { weight: 100 });
        batch.set(likes(db), { count: increment(1) }, { merge: true });
        await assertFails(batch.commit());
    });
});

describe("collections without rules", () => {
    it("are closed even for admins", async () => {
        await assertFails(read("admin", "other"));
        await assertFails(create("admin", "other"));
    });
});
