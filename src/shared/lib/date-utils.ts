export type DateFormat = "full" | "with-time" | "short" | "relative" | "month-year";

const MONTH_NAMES = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
] as const;

const MONTH_NAMES_SHORT = [
    "янв",
    "фев",
    "мар",
    "апр",
    "мая",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
] as const;

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/**
 * Форматирует ISO-дату в русский формат.
 * Для пустой или невалидной даты возвращает пустую строку.
 */
export const formatDate = (dateISO: string | null | undefined, format: DateFormat = "full"): string => {
    if (!dateISO) return "";

    const date = new Date(dateISO);
    if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateISO);
        return "";
    }

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    switch (format) {
        case "with-time":
            return `${day} ${MONTH_NAMES[month]} ${year} в ${hours}:${minutes}`;
        case "short":
            return `${day} ${MONTH_NAMES_SHORT[month]} ${year}`;
        case "relative":
            return getRelativeTime(date, new Date());
        case "month-year":
            return `${MONTH_NAMES[month]} ${year}`;
        case "full":
        default:
            return `${day} ${MONTH_NAMES[month]} ${year}`;
    }
};

/** Относительное время, например «2 дня назад». Старше недели — полная дата. */
const getRelativeTime = (date: Date, now: Date): string => {
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / DAY_MS);
    const diffHours = Math.floor(diffMs / HOUR_MS);
    const diffMinutes = Math.floor(diffMs / MINUTE_MS);

    if (diffMinutes < 1) return "только что";
    if (diffMinutes < 60) {
        return `${diffMinutes} ${pluralize(diffMinutes, "минуту", "минуты", "минут")} назад`;
    }
    if (diffHours < 24) {
        return `${diffHours} ${pluralize(diffHours, "час", "часа", "часов")} назад`;
    }
    if (diffDays === 1) return "вчера";
    if (diffDays === 2) return "позавчера";
    if (diffDays < 7) {
        return `${diffDays} ${pluralize(diffDays, "день", "дня", "дней")} назад`;
    }
    return formatDate(date.toISOString(), "full");
};

/** Склонение существительного после числительного: 1 день, 2 дня, 5 дней. */
export const pluralize = (count: number, one: string, few: string, many: string): string => {
    const n = Math.abs(count) % 100;
    if (n >= 5 && n <= 20) return many;
    const lastDigit = n % 10;
    if (lastDigit === 1) return one;
    if (lastDigit >= 2 && lastDigit <= 4) return few;
    return many;
};
