import React, { useState } from 'react';
import { withFirebase } from '../../firebase';
import { withAuthUser } from '../Auth';
import SettingsBtn from './SettingsBtn';
import SettingsWindow from './SettingsWindow';
import Modal from '../Modal';

const Settings = props => {
    const [windowStatus, setWindowStatus] = useState(false);
    const closeModal = () => setWindowStatus(false);
    const { authUser, firebase } = props;


    const signInWithGoogle = () => {
        firebase.auth.signInWithGoogle();
    }

    const signOut = () => {
        const confirm = window.confirm("Do you really want to Sign Out?");
        if (confirm) {
            firebase.auth.signOut();
            closeModal();
        }
    }

    return (
        <>
            {
                windowStatus &&
                <Modal close={closeModal} content={
                    <SettingsWindow authUser={authUser} signInWithGoogle={signInWithGoogle} signOut={signOut} />
                } />
            }
            <SettingsBtn clickHandler={() => setWindowStatus(true)} />
        </>
    )
};

export default withFirebase(withAuthUser(Settings));