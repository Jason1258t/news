import React, { useState, useEffect } from "react";
import styles from "./ScrollToTopButton.module.css";
import chevron from './chevron.svg';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <div className={styles.scrollToTop}>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className={styles.scrollButton}
                    aria-label="Scroll to top"
                >
                    <img src={chevron} alt="chevron-up"/>
                </button>
            )}
        </div>
    );
};

export default ScrollToTopButton;
