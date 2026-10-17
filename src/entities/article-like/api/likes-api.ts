import { doc, getDoc, increment, writeBatch } from "firebase/firestore";
import { db } from "shared/api";
import type { ArticleLikes } from "../model/types";

const COLLECTION = "likes";

const likesRef = (slug: string) => doc(db, COLLECTION, slug);
const voterRef = (slug: string, uid: string) => doc(db, COLLECTION, slug, "voters", uid);

const toCount = (value: unknown) => (typeof value === "number" && value > 0 ? value : 0);

/** Только число лайков — для карточек в ленте. */
export const fetchLikeCount = async (slug: string) => {
    try {
        return toCount((await getDoc(likesRef(slug))).data()?.count);
    } catch (error) {
        console.error("❌ Ошибка при получении лайков:", error);
        throw new Error("Не удалось загрузить лайки", { cause: error });
    }
};

/** Число лайков статьи и лайкнул ли её `uid` (без uid — читатель ещё не входил, значит нет). */
export const fetchArticleLikes = async (
    slug: string,
    uid: string | null,
): Promise<ArticleLikes> => {
    try {
        const [likes, voter] = await Promise.all([
            getDoc(likesRef(slug)),
            uid ? getDoc(voterRef(slug, uid)) : null,
        ]);
        return { count: toCount(likes.data()?.count), liked: voter?.exists() ?? false };
    } catch (error) {
        console.error("❌ Ошибка при получении лайков:", error);
        throw new Error("Не удалось загрузить лайки", { cause: error });
    }
};

/**
 * Ставит или снимает лайк одной пакетной записью: документ голосующего и count ± 1.
 * Правила пропускают только такую пару, поэтому повторный лайк того же uid отклоняется.
 */
export const setArticleLiked = (slug: string, uid: string, liked: boolean) => {
    const batch = writeBatch(db);
    if (liked) {
        batch.set(voterRef(slug, uid), {});
    } else {
        batch.delete(voterRef(slug, uid));
    }
    batch.set(likesRef(slug), { count: increment(liked ? 1 : -1) }, { merge: true });
    return batch.commit();
};
