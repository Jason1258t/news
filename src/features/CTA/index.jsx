import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CTASection.module.css";
import FilledButton from "widgets/buttons/FilledButton";
import OutlinedButton from "widgets/buttons/OutlinedButton";

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
                    <FilledButton
                        onClick={() =>
                            window.open("https://t.me/SSalVamvRotSuki")
                        }
                    >
                        Подписаться
                    </FilledButton>
                    <OutlinedButton onClick={() => navigate("/about")}>
                        О проекте
                    </OutlinedButton>
                </div>
            </div>
        </section>
    );
};

export default CTASetcion;
