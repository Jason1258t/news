import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ArticleContentBlock } from "entities/article";
import { ContentBlock } from "./ContentBloc";

const renderBlock = (block: ArticleContentBlock) => render(<ContentBlock block={block} />);

describe("ContentBlock", () => {
    it("renders a heading of the given level with inline HTML", () => {
        renderBlock({ type: "heading", level: 3, text: "Hello <em>world</em>" });
        const heading = screen.getByRole("heading", { level: 3 });
        expect(heading).toHaveTextContent("Hello world");
        expect(heading.querySelector("em")).toHaveTextContent("world");
    });

    it("renders a paragraph with inline HTML", () => {
        const { container } = renderBlock({ type: "paragraph", html: "a <strong>b</strong>" });
        expect(container.querySelector("p strong")).toHaveTextContent("b");
    });

    it("renders list items", () => {
        renderBlock({ type: "list", items: ["one", "<b>two</b>"] });
        expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["one", "two"]);
    });

    it("renders an image with caption", () => {
        renderBlock({ type: "image", url: "https://img/1.png", alt: "Alt", caption: "Caption" });
        expect(screen.getByRole("img", { name: "Alt" })).toHaveAttribute(
            "src",
            "https://img/1.png",
        );
        expect(screen.getByText("Caption")).toBeInTheDocument();
    });

    it.each([
        [undefined, "quote"],
        ["default", "quote"],
        ["warning", "quote warning"],
        ["critical", "quote critical"],
    ] as const)("renders a %s blockquote with class %j", (variant, className) => {
        const { container } = renderBlock({
            type: "blockquote",
            html: "text",
            footer: "src",
            variant,
        });
        const quote = container.querySelector("blockquote");
        expect(quote).toHaveAttribute("class", className);
        expect(quote?.querySelector("footer")).toHaveTextContent("src");
    });

    it("renders nested blocks inside a highlight", () => {
        renderBlock({
            type: "highlight",
            title: "Важно",
            content: [
                { type: "paragraph", html: "inside" },
                { type: "list", items: ["x"] },
            ],
        });
        expect(screen.getByRole("heading", { name: "Важно" })).toBeInTheDocument();
        expect(screen.getByText("inside")).toBeInTheDocument();
        expect(screen.getByRole("listitem")).toHaveTextContent("x");
    });

    it("renders a highlight without content", () => {
        const block = { type: "highlight", title: "Пусто" } as unknown as ArticleContentBlock;
        expect(() => renderBlock(block)).not.toThrow();
    });

    it("renders a footer note", () => {
        const { container } = renderBlock({ type: "footer-note", html: "note" });
        expect(container.querySelector(".article-footer")).toHaveTextContent("note");
    });

    it.each([
        ["inline", ".formula-inline"],
        ["block", ".formula-block"],
    ] as const)("renders a %s formula with KaTeX", (display, selector) => {
        const { container } = renderBlock({ type: "formula", formula: "x^2", display });
        expect(container.querySelector(`${selector} .katex`)).not.toBeNull();
    });

    it("renders code with filename and syntax highlighting", () => {
        const { container } = renderBlock({
            type: "code",
            code: "const x = 1;",
            language: "javascript",
            filename: "a.js",
        });
        expect(screen.getByText("a.js")).toBeInTheDocument();
        expect(
            container.querySelector("code.language-javascript .token.keyword"),
        ).toHaveTextContent("const");
    });

    it("renders a table with a header row", () => {
        renderBlock({
            type: "table",
            hasHeader: true,
            data: [
                ["H1", "H2"],
                ["a", "<b>b</b>"],
            ],
        });
        expect(screen.getAllByRole("columnheader").map((th) => th.textContent)).toEqual([
            "H1",
            "H2",
        ]);
        expect(screen.getAllByRole("cell").map((td) => td.textContent)).toEqual(["a", "b"]);
    });

    it("renders a table without a header row", () => {
        renderBlock({ type: "table", data: [["a", "b"]] });
        expect(screen.queryAllByRole("columnheader")).toHaveLength(0);
        expect(screen.getAllByRole("cell")).toHaveLength(2);
    });

    it("renders nothing for an empty table", () => {
        const { container } = renderBlock({ type: "table", data: [] });
        expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing and warns for an unknown block type", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const { container } = renderBlock({ type: "video" } as unknown as ArticleContentBlock);
        expect(container).toBeEmptyDOMElement();
        expect(warn).toHaveBeenCalledWith("Unknown block type: video");
    });
});
