import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "shared/api";

export interface SessionContextValue {
    user: User | null;
    /** true, пока Firebase не сообщил начальное состояние авторизации. */
    loading: boolean;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return <SessionContext.Provider value={{ user, loading }}>{children}</SessionContext.Provider>;
};
