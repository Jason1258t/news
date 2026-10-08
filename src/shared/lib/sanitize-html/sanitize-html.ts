import DOMPurify from "dompurify";

// Links that open a new tab must not get access to window.opener.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node instanceof HTMLAnchorElement && node.target === "_blank") {
        node.rel = "noopener noreferrer";
    }
});

/**
 * Removes anything executable from HTML that comes from Firestore or an LLM:
 * scripts, event handlers, javascript: URLs, iframes, SVG, forms and inputs. Inline formatting,
 * links, code and tables are kept.
 */
export const sanitizeHtml = (html: string): string =>
    DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ["target"],
        // Forms inside an article could be used for phishing.
        FORBID_TAGS: ["form", "input", "button", "textarea", "select", "option", "style"],
    });
