import { useState } from "react";
import styles from "./ImagePreview.module.css";

interface ImagePreviewProps {
    src?: string | null;
    alt?: string;
    onRemove?: () => void;
    width?: string;
    height?: string;
    maxHeight?: string;
}

/** Preview of an image URL with loading and error states; nothing for an empty URL. */
export const ImagePreview = ({ src, ...props }: ImagePreviewProps) =>
    // A new URL starts over: no stale error or "loaded" state from the previous one.
    src ? <Preview key={src} src={src} {...props} /> : null;

const Preview = ({
    src,
    alt = "Превью",
    onRemove,
    width = "100%",
    height = "auto",
    maxHeight = "400px",
}: ImagePreviewProps & { src: string }) => {
    const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

    return (
        <div className={styles.container}>
            <div className={styles.previewHeader}>
                <span className={styles.title}>Превью изображения</span>
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className={styles.removeButton}
                        title="Удалить изображение"
                        aria-label="Удалить изображение"
                    >
                        ×
                    </button>
                )}
            </div>

            <div className={styles.imageWrapper}>
                {status === "loading" && (
                    <div className={styles.loading} role="status">
                        <div className={styles.spinner}></div>
                        <span>Загрузка изображения...</span>
                    </div>
                )}

                <img
                    src={src}
                    alt={alt}
                    className={`${styles.previewImage} ${status === "error" ? styles.hidden : ""}`}
                    onLoad={() => setStatus("loaded")}
                    onError={() => setStatus("error")}
                    style={{ width, height, maxHeight }}
                />

                {status === "error" && (
                    <div className={styles.error} role="alert">
                        <div className={styles.errorIcon}>⚠️</div>
                        <span>Не удалось загрузить изображение</span>
                        {onRemove && (
                            <button type="button" onClick={onRemove} className={styles.errorButton}>
                                Удалить
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
