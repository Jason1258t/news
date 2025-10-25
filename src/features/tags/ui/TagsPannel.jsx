import React from "react";
import { useQueryTags } from "../hooks/useQueryTags";
import TagsDisplay from "widgets/tags/TagsDIsplay";

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
