import { Link, useSearchParams } from "react-router-dom";
import { TagsPanel } from "features/filter-by-tags";
import { ARTICLE_CATEGORIES } from "shared/config";
import styles from "./FeedHeader.module.css";

export const FeedHeader = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");

    // Switching the category keeps the selected tags.
    const hrefFor = (next: string | null) => {
        const params = new URLSearchParams(searchParams);
        if (next) params.set("category", next);
        else params.delete("category");
        const query = params.toString();
        return query ? `/?${query}` : "/";
    };

    const chips = [
        { label: "Все", value: null },
        ...ARTICLE_CATEGORIES.map((name) => ({ label: name, value: name as string })),
    ];

    return (
        <div className={styles.header}>
            <nav className={styles.chips} aria-label="Категории">
                {chips.map(({ label, value }) => (
                    <Link
                        key={label}
                        to={hrefFor(value)}
                        className={`${styles.chip} ${category === value ? styles.chipActive : ""}`}
                        aria-current={category === value ? "page" : undefined}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
            <TagsPanel />
        </div>
    );
};
