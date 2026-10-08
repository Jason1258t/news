import type { ArticleImageBlock } from "../../model/types";

export const ImageBlock = ({ url, alt, caption }: Omit<ArticleImageBlock, "type">) => (
    <div className="article-image">
        <img src={url} alt={alt} />
        {caption ? <span className="image-caption">{caption}</span> : null}
    </div>
);
