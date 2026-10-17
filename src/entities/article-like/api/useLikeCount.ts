import { useQuery } from "@tanstack/react-query";
import { fetchLikeCount } from "./likes-api";
import { likeKeys } from "./like-keys";

/** Число лайков статьи; `enabled: false` откладывает запрос (карточка ещё не на экране). */
export const useLikeCount = (slug: string, enabled = true) =>
    useQuery({
        queryKey: likeKeys.count(slug),
        queryFn: () => fetchLikeCount(slug),
        enabled,
    });
