import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editorsPickKeys, replaceEditorsPicks, type EditorsPick } from "entities/editors-pick";

export const useSaveEditorsPicks = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (picks: EditorsPick[]) =>
            replaceEditorsPicks(
                picks.map(({ title, description, badge, articleUrl }) => ({
                    title,
                    description,
                    badge,
                    articleUrl,
                })),
            ),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: editorsPickKeys.all }),
    });
};
