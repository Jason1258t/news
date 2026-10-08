import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDate, pluralize } from "./date-utils";

describe("formatDate", () => {
    const iso = "2025-03-07T09:05:00.000Z";

    it.each([
        ["full", "7 марта 2025"],
        ["with-time", "7 марта 2025 в 09:05"],
        ["short", "7 мар 2025"],
        ["month-year", "марта 2025"],
    ] as const)("formats %s", (format, expected) => {
        expect(formatDate(iso, format)).toBe(expected);
    });

    it("uses the full format by default", () => {
        expect(formatDate(iso)).toBe("7 марта 2025");
    });

    it.each([undefined, null, ""])("returns an empty string for %j", (value) => {
        expect(formatDate(value)).toBe("");
    });

    it("returns an empty string for an invalid date", () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        expect(formatDate("not a date")).toBe("");
    });

    describe("relative", () => {
        const now = new Date("2025-03-10T12:00:00.000Z");
        const ago = (ms: number) => new Date(now.getTime() - ms).toISOString();
        const MIN = 60 * 1000;
        const HOUR = 60 * MIN;
        const DAY = 24 * HOUR;

        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(now);
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it.each([
            [30 * 1000, "только что"],
            [1 * MIN, "1 минуту назад"],
            [3 * MIN, "3 минуты назад"],
            [11 * MIN, "11 минут назад"],
            [59 * MIN, "59 минут назад"],
            [1 * HOUR, "1 час назад"],
            [2 * HOUR, "2 часа назад"],
            [5 * HOUR, "5 часов назад"],
            [21 * HOUR, "21 час назад"],
            [1 * DAY, "вчера"],
            [2 * DAY, "позавчера"],
            [3 * DAY, "3 дня назад"],
            [6 * DAY, "6 дней назад"],
            [7 * DAY, "3 марта 2025"],
        ])("%i ms ago → %s", (diff, expected) => {
            expect(formatDate(ago(diff), "relative")).toBe(expected);
        });
    });
});

describe("pluralize", () => {
    const days = (n: number) => pluralize(n, "день", "дня", "дней");

    it.each([
        [0, "дней"],
        [1, "день"],
        [2, "дня"],
        [4, "дня"],
        [5, "дней"],
        [11, "дней"],
        [12, "дней"],
        [14, "дней"],
        [21, "день"],
        [22, "дня"],
        [101, "день"],
        [111, "дней"],
        [-1, "день"],
    ])("%i → %s", (n, expected) => {
        expect(days(n)).toBe(expected);
    });
});
