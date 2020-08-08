import React from 'react';
import logo from './google_signin_dark.png'
import styles from './AuthBtn.module.css';

const GoogleAuthBtn = (props) => {
    return (
        <button type="button" onClick={props.clickHandler} className={`button is-text ${styles.button}`}>            
            <img src={logo} alt="Sign In with Google" />
        </button>
    )
};

export default GoogleAuthBtn;