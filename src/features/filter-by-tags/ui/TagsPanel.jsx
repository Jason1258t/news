import React from "react";
import { useQueryTags } from "../model/useQueryTags";
import { TagList } from "./TagList";

export const TagsPanel = () => {
    const { selectedTags, removeTag, clearAllTags } = useQueryTags();
    return (
        selectedTags?.length > 0 && (
            <TagList
                selectedTags={selectedTags}
                onClearAll={clearAllTags}
                onRemoveTag={removeTag}
            />
        )
    );
};
