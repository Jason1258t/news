import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export const useQueryTags = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedTags = useMemo(() => {
        const tagsParam = searchParams.get("tags");
        console.log(`tagsParams: ${tagsParam}`);
        return tagsParam
            ? tagsParam.split(",").filter((tag) => tag.trim() !== "")
            : [];
    }, [searchParams]);

    const updateTagsInQuery = (tags) => {
        const newSearchParams = new URLSearchParams(searchParams);

        if (tags.length > 0) {
            newSearchParams.set("tags", tags.join(","));
        } else {
            newSearchParams.delete("tags");
        }

        setSearchParams(newSearchParams);
    };

    const addTag = (tag) => {
        const normalizedTag = tag.trim().toLowerCase();

        if (normalizedTag && !selectedTags.includes(normalizedTag)) {
            const newTags = [...selectedTags, normalizedTag];
            updateTagsInQuery(newTags);
        }
    };

    const removeTag = (tagToRemove) => {
        const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
        updateTagsInQuery(newTags);
    };

    const clearAllTags = () => {
        updateTagsInQuery([]);
    };

    return {
        selectedTags, // Теперь всегда актуальный
        addTag,
        removeTag,
        clearAllTags,
    };
};
