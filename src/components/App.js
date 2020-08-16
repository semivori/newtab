import React from 'react';
import { withBackgroundImage } from './BackgroundImage';
import styles from './App.module.css';
import Settings from './Settings';
import Bookmarks from './Bookmarks';
import { withAuthentication, withAuthUser } from './Auth';
import { withMessagesProvider } from './Messages';
import GoogleAuthBtn from './Auth/GoogleAuthBtn';

const App = props => {
    const classes = [styles.app];
    const { authUser, firebase } = props;

    const AuthBtn = (
        <div className={styles.boxMessage} >
            <div className="is-vcentered is-centered">
                <GoogleAuthBtn clickHandler={firebase.auth.signInWithGoogle} />
            </div>
        </div>
    );

    return (
        <div className={classes.join(' ')} onContextMenu={e => { e.preventDefault() }} >
            {
                authUser ?
                    <>
                        <Bookmarks />
                        <Settings />
                    </>
                    : AuthBtn
            }
        </div>
    );
}

export default withMessagesProvider(
    withAuthentication(
        withAuthUser(
            withBackgroundImage(
                App
            )
        )
    )
);