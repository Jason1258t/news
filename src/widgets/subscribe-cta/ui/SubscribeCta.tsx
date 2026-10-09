import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TELEGRAM_CHANNEL_URL } from "shared/config";
import { Button } from "shared/ui/button";
import chevronDown from "./chevron-down.svg";
import { clickableProps } from "shared/lib/a11y";
import styles from "./SubscribeCta.module.css";

export const SubscribeCta = () => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    const contentId = useId();

    return (
        <section className={styles.section}>
            <div className={styles.content}>
                {/* Мобильная версия - свернутый вид */}
                <div
                    className={styles.mobileHeader}
                    {...clickableProps(() => setIsExpanded((expanded) => !expanded))}
                    aria-expanded={isExpanded}
                    aria-controls={contentId}
                >
                    <span>Наши обновления</span>
                    <img
                        src={chevronDown}
                        alt=""
                        className={`${styles.chevron} ${isExpanded ? styles.rotated : ""}`}
                    />
                </div>

                {/* Контент для десктопа и раскрытый для мобилки */}
                <div
                    id={contentId}
                    className={`${styles.desktopContent} ${isExpanded ? styles.expanded : ""}`}
                >
                    <p>
                        Подпишитесь на наши обновления, чтобы первыми получать самые важные и
                        интересные новости
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
                </div>
            </div>
        </section>
    );
};
