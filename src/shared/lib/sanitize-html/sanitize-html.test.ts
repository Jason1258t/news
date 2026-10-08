import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "./sanitize-html";

describe("sanitizeHtml", () => {
    it.each([
        ["<img src=x onerror=alert(1)>", '<img src="x">'],
        ['<a href="javascript:alert(1)">x</a>', "<a>x</a>"],
        ["<script>alert(1)</script>text", "text"],
        ['<iframe src="https://evil"></iframe>', ""],
        ['<p onclick="alert(1)">x</p>', "<p>x</p>"],
        ["<svg><script>alert(1)</script></svg>", ""],
        ['<form action="https://evil"><input name="p"></form>', ""],
        ['<button formaction="https://evil">ok</button>', "ok"],
        ["<style>body{display:none}</style>x", "x"],
    ])("neutralizes %s", (input, expected) => {
        expect(sanitizeHtml(input)).toBe(expected);
    });

    it("keeps the markup that articles actually use", () => {
        const html =
            "<strong>a</strong> <em>b</em> <del>c</del> <code>d</code><br>" +
            '<a class="ref" href="#note">e</a> <a href="https://example.com">f</a>';
        expect(sanitizeHtml(html)).toBe(html);
    });

    it("keeps tables with their presentational attributes", () => {
        const html =
            '<table border="1" cellpadding="4" style="width: 100%"><thead><tr><th>h</th></tr></thead>' +
            "<tbody><tr><td>v</td></tr></tbody></table>";
        expect(sanitizeHtml(html)).toBe(html);
    });

    it("keeps target=_blank and adds a safe rel", () => {
        expect(sanitizeHtml('<a href="https://example.com" target="_blank">x</a>')).toBe(
            '<a href="https://example.com" target="_blank" rel="noopener noreferrer">x</a>',
        );
    });
});
