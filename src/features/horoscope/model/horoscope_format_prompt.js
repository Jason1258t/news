import { zodiacIcons } from "./zodiac-icons";
import toast from "react-hot-toast";

export const horoscopeFormatPrompt = `
Переформатируй данный гороскоп в формат для базы данных, используя вот эти типы. 
Для типов вроде Date, учитывай, что это будет отправлено в firebase firestore и преобразовано подобным образом Timestamp.fromDate(horoscope.createdAt):

ТИПЫ ДАННЫХ:
/**
 * @typedef {Object} ZodiacPrediction
 * @property {string} imageUrl - URL изображения знака зодиака
 * @property {string} zodiacName - Название знака зодиака
 * @property {string} prediction - Предсказание для знака
 */

/**
 * @typedef {Object} Horoscope
 * @property {string} imageUrl - URL основного изображения гороскопа
 * @property {string} title - Заголовок гороскопа
 * @property {string} description - Описание гороскопа
 * @property {Array<ZodiacPrediction>} predictions - Предсказания по знакам зодиака
 * @property {Date} createdAt - Дата создания
 * @property {Date} startsAt - Дата начала действия
 * @property {Date} endsAt - Дата окончания действия
 */

ИЗОБРАЖЕНИЯ ДЛЯ ЗНАКОВ ЗОДИАКА:
${Object.entries(zodiacIcons)
    .map(([zodiac, url]) => `• ${zodiac}: ${url}`)
    .join("\n")}

ВАЖНЫЕ УКАЗАНИЯ:
1. Если тут не указаны title и description, попроси пользователя их написать
2. В качестве основного изображения гороскопа используй: https://i.pinimg.com/736x/fc/d2/91/fcd2912b6be1c8ae57cf311fcc9147c0.jpg
3. Для каждого знака зодиака используй соответствующее изображение из списка выше
4. Если startsAt и endsAt не указаны, используй текущую неделею (начало - понедельник, окончание - воскресенье)
`;

export const copyFormatPrompt = async ({
    title,
    description,
    startsAt,
    endsAt,
}) => {
    try {
        let fullPrompt = horoscopeFormatPrompt;

        if (title) fullPrompt += "\ntitle: " + title;
        if (description) fullPrompt += "\ndescription: " + description;
        if (startsAt) fullPrompt += "\nstartsAt: " + startsAt;
        if (endsAt) fullPrompt += "\nendsAt: " + endsAt;

        await navigator.clipboard.writeText(fullPrompt);
        toast.success("Шаблон успешно скопирован!");
    } catch (err) {
        toast.error("Ошибка копирования");
        console.error("Failed to copy text: ", err);
    }
};
