import React, { useState } from 'react';
import styles from './Card.module.css';

const Card = (props) => {
    const [contentStatus, setContentStatus] = useState(true);

    const toggleContent = () => {
        setContentStatus(!contentStatus);
    };

    return (
        <div className="card has-background-grey-dark">
            <header className="card-header">
                <p className="card-header-title">{props.header}</p>
                <button className={`${styles.headerButton} card-header-icon`} onClick={toggleContent} aria-label="more options">
                    <span className="icon"><i className="fas fa-angle-down" aria-hidden="true"></i></span>
                </button>
            </header>
            {
                contentStatus &&
                <div className="card-content">
                    <div className="content">
                        {props.children}
                    </div>
                </div>
            }
        </div>
    )
}

export default Card;