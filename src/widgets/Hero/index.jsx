import React from "react";
import styles from './HeroWidget.module.css';

/**
 * @typedef {Object} Props
 * @property {string} title
 * @property {string} subtitle
 */

/** @type {React.FC<Props>} */
const HeroWidget = ({ title, subtitle }) => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>{title}</h1>
                <p className={styles.heroSubtitle}>{subtitle}</p>
            </div>
        </section>
    );
};

export default HeroWidget;