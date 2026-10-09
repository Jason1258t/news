const pad = (value: number) => String(value).padStart(2, "0");

/** Local date and time in the format of <input type="datetime-local">: YYYY-MM-DDTHH:mm. */
export const toDateTimeLocal = (date: Date): string =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
