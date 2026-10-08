export const EDITORS_PICK_BADGES = [
    "Must Read",
    "Deep Dive",
    "Trending",
    "Case Study",
    "Tutorial",
    "Research",
] as const;

export type EditorsPickBadge = (typeof EDITORS_PICK_BADGES)[number];

export interface EditorsPick {
    /** ID документа в Firestore (или локальный id до сохранения). */
    id: string;
    title: string;
    description: string;
    badge: EditorsPickBadge;
    /** Ссылка на статью. */
    articleUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

/** Поля, из которых создаётся запись подборки. */
export type EditorsPickInput = Pick<EditorsPick, "title" | "badge" | "articleUrl"> & {
    description?: string;
};
