import { useNavigate } from "react-router-dom";
import { TELEGRAM_CHANNEL_URL } from "shared/config";
import { Button } from "shared/ui/button";
import styles from "./SubscribeCta.module.css";

/** Native feed block: asks readers to follow the Telegram channel. */
export const SubscribeCta = () => {
    const navigate = useNavigate();

    return (
        <section className={styles.section} aria-label="Подписка на обновления">
            <p className={styles.text}>
                Подпишитесь на наши обновления, чтобы первыми получать самые важные и интересные
                новости
            </p>
            <div className={styles.buttons}>
                <Button
                    onClick={() =>
                        window.open(TELEGRAM_CHANNEL_URL, "_blank", "noopener,noreferrer")
                    }
                >
                    Подписаться
                </Button>
                <Button variant="secondary" onClick={() => navigate("/about")}>
                    О проекте
                </Button>
            </div>
        </section>
    );
};
