import { useMemo } from "react";
import { sanitizeHtml } from "shared/lib/sanitize-html";

/** Renders HTML from Firestore after sanitizing it. */
export const RenderHtml = ({ html }: { html: string }) => {
    const safeHtml = useMemo(() => sanitizeHtml(html), [html]);
    return <span dangerouslySetInnerHTML={{ __html: safeHtml }} />;
};
