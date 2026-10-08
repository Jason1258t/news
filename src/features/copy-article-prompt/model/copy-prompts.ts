import toast from "react-hot-toast";
import {
    buildArticleFormatPrompt,
    buildTelegramPostPrompt,
    getMissingPublicationFields,
    type PublicationInfo,
} from "./build-prompts";

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success("Шаблон успешно скопирован!");
        return true;
    } catch (error) {
        toast.error("Ошибка копирования");
        console.error("Failed to copy text:", error);
        return false;
    }
};

export const copyArticleFormatPrompt = async (publication: PublicationInfo) => {
    const copied = await copyToClipboard(buildArticleFormatPrompt(publication));
    const missing = getMissingPublicationFields(publication);
    if (copied && missing.length > 0) {
        toast(`В промпте не указано: ${missing.join(", ")}`, { icon: "⚠️" });
    }
};

export const copyTelegramPostPrompt = () => copyToClipboard(buildTelegramPostPrompt());
