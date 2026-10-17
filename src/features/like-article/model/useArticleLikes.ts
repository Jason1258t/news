import { useQuery } from "@tanstack/react-query";
import { fetchArticleLikes, likeKeys } from "entities/article-like";
import { useSession } from "entities/session";

/** Лайки статьи для текущего читателя; ждёт, пока Firebase восстановит вход. */
export const useArticleLikes = (slug: string) => {
    const { visitorId, loading } = useSession();

    return useQuery({
        queryKey: likeKeys.detail(slug, visitorId),
        queryFn: () => fetchArticleLikes(slug, visitorId),
        enabled: !loading,
    });
};
