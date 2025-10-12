import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CTASection.module.css";

const CTASetcion = () => {
    const navigate = useNavigate();

    return (
        <section className={styles.section}>
            <div className={styles.content}>
                <h3>Оставайтесь в курсе событий</h3>
                <p>
                    Подпишитесь на наши обновления, чтобы первыми получать самые
                    важные и интересные новости
                </p>
                <div className={styles.buttons}>
                    <button
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={() =>
                            window.open("https://t.me/SSalVamvRotSuki")
                        }
                    >
                        Подписаться
                    </button>
                    <button
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        onClick={() => navigate("/about")}
                    >
                        О проекте
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTASetcion;
