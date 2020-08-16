import React from 'react';
import { withBackgroundImage } from './BackgroundImage';
import styles from './App.module.css';
import Settings from './Settings';
import Bookmarks from './Bookmarks';
import { withAuthentication, withAuthUser } from './Auth';
import { withMessagesProvider } from './Messages';

const App = props => {
    const classes = [styles.app];
    
    return (
        <div className={classes.join(' ')} onContextMenu={e => {e.preventDefault()}} >
            {props.authUser && <Bookmarks />}
            <Settings />
        </div>
    );
}

export default withMessagesProvider(withAuthentication(withAuthUser(withBackgroundImage(App))));