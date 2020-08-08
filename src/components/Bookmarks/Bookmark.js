import React from 'react';
import { UrlHelper } from '../../utils';
import styles from './Bookmark.module.css';

const Bookmark = (props) => {
    const { item } = props;

    const icon = item.img
        ? <img className={styles.icon} src={item.img} alt={item.name} />
        : <span>{item.short.slice(0, 2)}</span>;

    const rightClickHandler = e => {
        e.preventDefault();
    };

    return (
        <div className={`is-dark-transparent ${styles.box}`} onContextMenu={rightClickHandler}>
            <a href={UrlHelper.formatHref(item.link)} className={styles.link}>
                <div className={styles.iconContainer}>
                    {icon}
                </div>
                <div className={styles.labelContainer}>
                    <span className={`${styles.label} ${styles.text}`}>{item.name}</span>
                </div>
            </a>
        </div>
    )
}

export default Bookmark;