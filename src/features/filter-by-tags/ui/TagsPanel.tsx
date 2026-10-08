import { useQueryTags } from "../model/useQueryTags";
import { TagList } from "./TagList";

export const TagsPanel = () => {
    const { selectedTags, removeTag, clearAllTags } = useQueryTags();
    if (selectedTags.length === 0) return null;

    return (
        <TagList selectedTags={selectedTags} onClearAll={clearAllTags} onRemoveTag={removeTag} />
    );
};
