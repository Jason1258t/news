import { Heart } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useLikeCount } from "../api/useLikeCount";
import styles from "./LikeCount.module.css";

/** Число лайков в карточке. Загружается, когда карточка показалась на экране; ноль не показывает. */
export const LikeCount = ({ slug }: { slug: string }) => {
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });
    const { data: count = 0 } = useLikeCount(slug, inView);

    return (
        <span ref={ref} className={styles.count}>
            {count > 0 ? (
                <>
                    <Heart size={14} aria-hidden />
                    <span aria-label={`Лайков: ${count}`}>{count}</span>
                </>
            ) : null}
        </span>
    );
};
