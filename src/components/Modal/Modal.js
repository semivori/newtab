import React from 'react';
import styles from './Modal.module.css';

const Modal = (props) => {
    const {close} = props;

    return (
        <React.Fragment>
            <div className={styles.background} onClick={close}></div>
            <div className={styles.modal}>
                {props.content}
            </div>
        </React.Fragment>
    )
}

export default Modal;