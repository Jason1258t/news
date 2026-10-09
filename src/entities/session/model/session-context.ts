import type { User } from "firebase/auth";
import { createContext } from "react";

export interface SessionContextValue {
    user: User | null;
    /** true, пока Firebase не сообщил начальное состояние авторизации. */
    loading: boolean;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
