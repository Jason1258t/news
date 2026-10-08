import { OutlinedButton } from "shared/ui/button";
import { copyArticleFormatPrompt, copyTelegramPostPrompt } from "../model/copy-prompts";
import type { PublicationInfo } from "../model/build-prompts";

export const CopyPromptButtons = ({ publishDate, imageUrl }: PublicationInfo) => (
    <>
        <OutlinedButton onClick={() => copyArticleFormatPrompt({ publishDate, imageUrl })}>
            Скопировать промпт форматирования
        </OutlinedButton>
        <OutlinedButton onClick={copyTelegramPostPrompt}>Скопировать промпт для тг</OutlinedButton>
    </>
);
