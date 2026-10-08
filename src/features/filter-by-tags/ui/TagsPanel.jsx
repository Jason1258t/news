import React from "react";
import { useQueryTags } from "../model/useQueryTags";
import TagsDisplay from "./TagList";

const TagsPannel = () => {
    const { selectedTags, removeTag, clearAllTags } = useQueryTags();
    return (
        selectedTags?.length > 0 && (
            <TagsDisplay
                selectedTags={selectedTags}
                onClearAll={clearAllTags}
                onRemoveTag={removeTag}
            />
        )
    );
};

export default TagsPannel;
