import type { ArticleImageBlock } from "../../model/types";
import styles from "./Blocks.module.css";

export const ImageBlock = ({ url, alt, caption }: Omit<ArticleImageBlock, "type">) => (
    <div className={styles.image}>
        <img src={url} alt={alt} />
        {caption ? <span className={styles.caption}>{caption}</span> : null}
    </div>
);
