import React from 'react';
import withAuthUser from '../withAuthUser';
import styles from './Profile.module.css'

const Profile = (props) => {
    const { authUser } = props;

    return (
        <div className={`${styles.profileWrapper}`}>
            {
                <div className={styles.profileInfo}>
                    {authUser.photoURL && <img src={authUser.photoURL} alt='avatar' className={styles.profileAvatar} />}
                    {authUser.displayName && authUser.displayName}
                    {
                        authUser.isAnonymous && 
                        (<span>You are authorized through an anonymous account. Please <b>Sign In</b> to save progress on other devices.</span>                        )
                    }
                </div>
            }
        </div>
    );
}

export default withAuthUser(Profile);