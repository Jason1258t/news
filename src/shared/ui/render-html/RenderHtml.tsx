/** Renders trusted HTML as-is. TODO(stage 1): sanitize (DOMPurify) — content comes from Firestore. */
export const RenderHtml = ({ html }: { html: string }) => (
    <span dangerouslySetInnerHTML={{ __html: html }} />
);
