import { zodiacIcons } from "./zodiac-icons";
import toast from "react-hot-toast";

export const horoscopeFormatPrompt = `
Переформатируй данный гороскоп, в формат для базы данных, используя вот эти типы
/**
 * @typedef {Object} ZodiacPrediction
 * @property {string} imageUrl
 * @property {string} zodiacName
 * @property {string} prediction
 */

/**
 * @typedef {Object} Horoscope
 * @property {string} imageUrl
 * @property {string} title
 * @property {string} description
 * @property {Array<ZodiacPrediction>} predictions
 * @property {Date} createdAt
 * @property {Date} startsAt
 * @property {Date} endsAt
 */

Подставляй изображения для знаков зодиака отсюда
${zodiacIcons}

Если не указаны title и description, попроси пользователя их написать
В качестве изображения у гороскопа пока будет https://i.pinimg.com/736x/fc/d2/91/fcd2912b6be1c8ae57cf311fcc9147c0.jpg
`

export const copyFormatPrompt = async ({ title, description }) => {
    try {
        let fullPrompt = horoscopeFormatPrompt;
        
        if (title) fullPrompt += "\ntitle: " + title;
        if (description) fullPrompt += "\ndescri[tion: " += description;

        await navigator.clipboard.writeText(fullPrompt);
        toast.success("Шаблон успешно скопирован!");
    } catch (err) {
        toast.error("Ошибка копирования");
        console.error("Failed to copy text: ", err);
    }
};
