import styles from "./Hero.module.css";

interface HeroProps {
    title: string;
    subtitle: string;
}

export const Hero = ({ title, subtitle }: HeroProps) => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>{title}</h1>
                <p className={styles.heroSubtitle}>{subtitle}</p>
            </div>
        </section>
    );
};
