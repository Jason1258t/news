import { useMutation, useQueryClient } from "@tanstack/react-query";
import { articleKeys, deleteArticle } from "entities/article";

/** Удаление статьи: ленты перезапрашиваются, кеш самой статьи удаляется. */
export const useDeleteArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slug: string) => deleteArticle(slug),
        onSuccess: async (_, slug) => {
            queryClient.removeQueries({ queryKey: articleKeys.detail(slug) });
            await queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
        },
    });
};
