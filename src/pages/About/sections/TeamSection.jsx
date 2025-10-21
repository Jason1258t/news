import React from "react";
import styles from "./TeamSection.module.css";

const TeamSection = () => {
    const teamCategories = [
        {
            role: "Разработчики",
            steamIds: ["76561199007797490", "76561199042071510"],
        },
        {
            role: "Редакторы",
            steamIds: ["76561199007797490", "76561198883069814"],
        },
    ];

    const renderSteamCard = (steamId, index) => (
        <div key={steamId} className={styles.steamCard}>
            <iframe
                src={`https://gamer2810.github.io/steam-miniprofile/?accountId=${steamId}`}
                scrolling="no"
                frameBorder="0"
                height="170px"
                width="330px"
                allowFullScreen
                title={`Участник команды ${index + 1}`}
            />
        </div>
    );

    return (
        <section>
            <div className={styles.categories}>
                {teamCategories.map((category) => (
                    <div key={category.role} className={styles.category}>
                        <h3 className={styles.roleTitle}>{category.role}</h3>
                        <div className={styles.cards}>
                            {category.steamIds.map((steamId, index) =>
                                renderSteamCard(steamId, index)
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TeamSection;
