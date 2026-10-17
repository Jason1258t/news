import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { likeKeys, setArticleLiked } from "entities/article-like";
import { ensureVisitorId } from "entities/session";

/**
 * Ставит (`true`) или снимает (`false`) лайк. При первом лайке читатель анонимно входит
 * в Firebase. Мутация остаётся pending, пока лайки не перезапрошены, — кнопка до тех пор
 * показывает ожидаемое состояние (см. LikeButton).
 */
export const useToggleLike = (slug: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (liked: boolean) => {
            const uid = await ensureVisitorId();
            await setArticleLiked(slug, uid, liked);
        },
        onError: () => {
            toast.error("Не удалось сохранить лайк");
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: likeKeys.article(slug) }),
    });
};
