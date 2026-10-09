import { Button } from "shared/ui/button";
import { copyArticleFormatPrompt, copyTelegramPostPrompt } from "../model/copy-prompts";
import type { PublicationInfo } from "../model/build-prompts";

export const CopyPromptButtons = ({ publishDate, imageUrl }: PublicationInfo) => (
    <>
        <Button
            variant="secondary"
            onClick={() => copyArticleFormatPrompt({ publishDate, imageUrl })}
        >
            Скопировать промпт форматирования
        </Button>
        <Button variant="secondary" onClick={copyTelegramPostPrompt}>
            Скопировать промпт для тг
        </Button>
    </>
);
