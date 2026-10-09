import { useEffect, useState } from "react";
import styles from "./ScrollToTopButton.module.css";
import chevron from "./chevron.svg";

/** Appears after scrolling down 300px; scrolls the page back to the top. */
export const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => setIsVisible(window.scrollY > 300);
        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div className={styles.scrollToTop}>
            {isVisible && (
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className={styles.scrollButton}
                    aria-label="Наверх"
                >
                    <img src={chevron} alt="" />
                </button>
            )}
        </div>
    );
};
