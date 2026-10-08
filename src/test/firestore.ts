import type { DocumentSnapshot } from "firebase/firestore";

/** Минимальный фейк DocumentSnapshot для тестов мапперов. */
export const fakeDocSnapshot = (id: string, data: Record<string, unknown> | undefined) =>
    ({
        id,
        data: () => data,
        exists: () => data !== undefined,
    }) as unknown as DocumentSnapshot;
