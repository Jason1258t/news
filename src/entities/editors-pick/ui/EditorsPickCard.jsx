import React from "react";
import styles from "./EditorsPickCard.module.css";

/**
 * @typedef {Object} Props
 * @property {EditorsPick} pick
 */

/** @type {React.FC<Props>} */
const EditorsPickCard = ({ pick }) => {
    return (
        <div className={styles.pickItem}>
            <div className={styles.pickBadge}>{pick.badge}</div>
            <h4 className={styles.pickTitle}>{pick.title}</h4>
            {/* <p className={styles.pickDescription}>{pick.description}</p> */}
        </div>
    );
};

export default EditorsPickCard;
