import React from 'react';
import { withBackgroundImage } from './BackgroundImage';
import styles from './App.module.css';
import Settings from './Settings';
import Bookmarks from './Bookmarks';
import { withAuthentication, withAuthUser } from './Auth';
import { withMessagesProvider } from './Messages';
import GoogleAuthBtn from './Auth/GoogleAuthBtn';

const Container = (props) => {
    return (

        <div className={props.classes.join(' ')} onContextMenu={e => { e.preventDefault() }} >
            {props.children}
        </div>
    )
}

const App = props => {
    const classes = [styles.app];
    const { authLoading, authUser, firebase } = props;

    if (authLoading) {
        return <Container classes={classes}>
            <div className="w-100 has-text-centered">
                <span className="button is-text is-loading"></span>
            </div>
        </Container>
    }

    if (!authUser) {
        return <Container classes={classes}>
            <div className={styles.boxMessage} >
                <div className="is-vcentered is-centered">
                    <GoogleAuthBtn clickHandler={firebase.auth.signInWithGoogle} />
                </div>
            </div>
        </Container>
    }

    return (
        <Container classes={classes}>
            <Bookmarks />
            <Settings />
        </Container>
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