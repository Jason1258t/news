import type { User } from "firebase/auth";
import { createContext } from "react";

export interface SessionContextValue {
    /** Вошедший по email сотрудник; анонимный читатель сюда не попадает. */
    user: User | null;
    /** uid любого вошедшего, включая анонимного читателя (лайки). */
    visitorId: string | null;
    /** true, пока Firebase не сообщил начальное состояние авторизации. */
    loading: boolean;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
