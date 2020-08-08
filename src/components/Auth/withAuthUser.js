import React from 'react';
import AuthUserContext from './context';

const withAuthUser = Component => {
    return (props) => {
        return (
            <AuthUserContext.Consumer>
                {
                    authUser => {
                        return <Component authUser={authUser} {...props} />
                    }
                }
            </AuthUserContext.Consumer>
        );
    };
};

export default withAuthUser;