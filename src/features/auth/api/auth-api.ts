import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "shared/api";
import { getErrorMessage } from "shared/lib/error";

export const authApi = {
    loginWithEmail: async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { user: userCredential.user, error: null };
        } catch (error) {
            return { user: null, error: getErrorMessage(error) };
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            return { error: null };
        } catch (error) {
            return { error: getErrorMessage(error) };
        }
    },
};
