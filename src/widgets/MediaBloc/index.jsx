import React from 'react'

import styles from './MediaBloc.module.css';

const MediaBloc = ({ title, content, imageUrl, align = "left" }) => {
    return (
        <div className={styles.bloc} style={align === "left" ? {} : { flexDirection: "row-reverse" }}>
            <img className={styles.media} src={imageUrl} />
            <div>
                <h3>{title}</h3>
                <p>{content}</p>
            </div>
        </div>
    )
}

export default MediaBloc