import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "app/firebase";

export const authApi = {
    loginWithEmail: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            return { user: userCredential.user, error: null };
        } catch (error) {
            return { user: null, error: error.message };
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            return { error: null };
        } catch (error) {
            return { error: error.message };
        }
    },
};
