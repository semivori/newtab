import React from 'react';
import styles from './Panel.module.css';

const Panel = (props) => {
    return (
        <div className={styles.panel} >
            {props.bookmarks}
        </div>
    )
}

export default Panel;
