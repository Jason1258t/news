import type { DocumentSnapshot, QuerySnapshot } from "firebase/firestore";

/** Минимальный фейк DocumentSnapshot для тестов мапперов и API. */
export const fakeDocSnapshot = (id: string, data: Record<string, unknown> | undefined) =>
    ({
        id,
        data: () => data,
        get: (field: string) => data?.[field],
        exists: () => data !== undefined,
    }) as unknown as DocumentSnapshot;

export const fakeQuerySnapshot = (docs: DocumentSnapshot[]) =>
    ({ docs, empty: docs.length === 0, size: docs.length }) as unknown as QuerySnapshot;
