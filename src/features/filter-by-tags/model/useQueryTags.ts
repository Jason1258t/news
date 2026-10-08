import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/** Selected tags, stored in the `?tags=a,b` query param. */
export const useQueryTags = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedTags = useMemo(() => {
        const tagsParam = searchParams.get("tags");
        return tagsParam ? tagsParam.split(",").filter((tag) => tag.trim() !== "") : [];
    }, [searchParams]);

    const updateTagsInQuery = (tags: string[]) => {
        const newSearchParams = new URLSearchParams(searchParams);

        if (tags.length > 0) {
            newSearchParams.set("tags", tags.join(","));
        } else {
            newSearchParams.delete("tags");
        }

        setSearchParams(newSearchParams);
    };

    const addTag = (tag: string) => {
        const normalizedTag = tag.trim().toLowerCase();

        if (normalizedTag && !selectedTags.includes(normalizedTag)) {
            updateTagsInQuery([...selectedTags, normalizedTag]);
        }
    };

    const removeTag = (tagToRemove: string) => {
        updateTagsInQuery(selectedTags.filter((tag) => tag !== tagToRemove));
    };

    const clearAllTags = () => {
        updateTagsInQuery([]);
    };

    return {
        selectedTags,
        addTag,
        removeTag,
        clearAllTags,
    };
};
