import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TELEGRAM_CHANNEL_URL } from "shared/config";
import { FilledButton, OutlinedButton } from "shared/ui/button";
import chevronDown from "./chevron-down.svg";
import styles from "./SubscribeCta.module.css";

export const SubscribeCta = () => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <section className={styles.section}>
            <div className={styles.content}>
                {/* Мобильная версия - свернутый вид */}
                <div className={styles.mobileHeader} onClick={toggleExpand}>
                    <span>Наши обновления</span>
                    <img
                        src={chevronDown}
                        alt=""
                        className={`${styles.chevron} ${isExpanded ? styles.rotated : ""}`}
                    />
                </div>

                {/* Контент для десктопа и раскрытый для мобилки */}
                <div className={`${styles.desktopContent} ${isExpanded ? styles.expanded : ""}`}>
                    <p>
                        Подпишитесь на наши обновления, чтобы первыми получать самые важные и
                        интересные новости
                    </p>
                    <div className={styles.buttons}>
                        <FilledButton onClick={() => window.open(TELEGRAM_CHANNEL_URL)}>
                            Подписаться
                        </FilledButton>
                        <OutlinedButton onClick={() => navigate("/about")}>
                            О проекте
                        </OutlinedButton>
                    </div>
                </div>
            </div>
        </section>
    );
};
