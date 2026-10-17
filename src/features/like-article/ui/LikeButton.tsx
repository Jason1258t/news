import { Heart } from "lucide-react";
import { useArticleLikes } from "../model/useArticleLikes";
import { useToggleLike } from "../model/useToggleLike";
import styles from "./LikeButton.module.css";

export const LikeButton = ({ slug }: { slug: string }) => {
    const { data } = useArticleLikes(slug);
    const toggle = useToggleLike(slug);

    let liked = data?.liked ?? false;
    let count = data?.count ?? 0;
    // Пока запись не подтверждена, показываем её результат поверх того, что пришло с сервера.
    if (toggle.isPending && toggle.variables !== liked) {
        liked = toggle.variables;
        count = Math.max(0, count + (liked ? 1 : -1));
    }

    return (
        <div className={styles.bar}>
            <button
                type="button"
                className={`${styles.button} ${liked ? styles.liked : ""}`}
                aria-pressed={liked}
                aria-label={liked ? "Убрать лайк" : "Нравится"}
                disabled={!data || toggle.isPending}
                onClick={() => toggle.mutate(!liked)}
            >
                <Heart size={20} aria-hidden fill={liked ? "currentColor" : "none"} />
                <span className={styles.count}>{count}</span>
            </button>
        </div>
    );
};
