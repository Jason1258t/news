import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState, type ReactNode } from "react";
import { auth } from "shared/api";
import { SessionContext } from "./session-context";

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [current, setCurrent] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setCurrent(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Анонимный вход нужен только для лайков: для остального приложения это гость.
    const user = current && !current.isAnonymous ? current : null;

    return (
        <SessionContext.Provider value={{ user, visitorId: current?.uid ?? null, loading }}>
            {children}
        </SessionContext.Provider>
    );
};
