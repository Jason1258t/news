import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "shared/api";
import { SEED_ADMIN } from "../../emulator/seed-data.ts";

export { seedEmulators } from "../../emulator/seed.ts";
export { allBlocksArticle, seedArticles } from "../../emulator/seed-data.ts";

/** Signs the app's Firebase client in as the seeded admin (has the "admin" claim). */
export const signInAsAdmin = () =>
    signInWithEmailAndPassword(auth, SEED_ADMIN.email, SEED_ADMIN.password);

export const signOutUser = () => signOut(auth);
