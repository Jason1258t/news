import { describe, expect, it } from "vitest";
import { getInternalSource, getLandingSource, linkFrom, withFromParam } from "./source";

const SITE = "https://vtech-news.ru";

describe("getLandingSource", () => {
    it.each([
        ["a channel post link", `${SITE}/#/articles/a?from=tg`, ""],
        ["a channel link even with a referrer", `${SITE}/#/articles/a?from=tg`, "https://ya.ru/"],
        ["the tag before the hash", `${SITE}/?from=tg#/articles/a`, ""],
        ["the Telegram web client", `${SITE}/#/articles/a`, "https://web.telegram.org/"],
        ["t.me", `${SITE}/`, "https://t.me/channel/12"],
    ])("telegram: %s", (_, href, referrer) => {
        expect(getLandingSource(href, referrer)).toBe("telegram");
    });

    it.each([
        ["https://www.google.com/", "search"],
        ["https://yandex.ru/search/?text=x", "search"],
        ["https://ya.ru/", "search"],
        ["https://duckduckgo.com/", "search"],
        ["https://habr.com/ru/articles/1/", "external"],
        ["https://notgoogle.example/", "external"],
        [`${SITE}/#/`, "site"],
        ["", "direct"],
        ["not a url", "direct"],
    ])("referrer %s → %s", (referrer, source) => {
        expect(getLandingSource(`${SITE}/#/articles/a`, referrer)).toBe(source);
    });

    it("knows the editors' picks tag and ignores unknown tags", () => {
        expect(getLandingSource(`${SITE}/#/articles/a?from=picks`, "")).toBe("picks");
        expect(getLandingSource(`${SITE}/#/articles/a?from=spam`, "")).toBe("direct");
    });
});

describe("links inside the site", () => {
    it("carries the source in router state", () => {
        expect(getInternalSource(linkFrom("feed"))).toBe("feed");
        expect(getInternalSource(null)).toBe("site");
        expect(getInternalSource({ from: "nonsense" })).toBe("site");
    });

    it("tags links that open in a new tab", () => {
        expect(withFromParam("/articles/a", "picks")).toBe("/articles/a?from=picks");
        expect(withFromParam("/articles/a?x=1", "picks")).toBe("/articles/a?x=1&from=picks");
    });
});
