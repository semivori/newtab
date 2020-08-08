import React from 'react';
import AuthUserContext from './context';
import { withFirebase } from '../../firebase';
import { withMessagesValue } from '../Messages';

const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                authUser: null,
                signInAnonymouslyAttempt: 0,
            };
        }

        componentDidMount() {
            this.listener = this.props.firebase.authObject.onAuthStateChanged(
                authUser => {
                    if (authUser) {
                        //authUser.isAnonymous && this.props.messages.pushMessage({ content: "Please Sign In to save progress on other devices." })
                        this.setState({ authUser });
                    } else if (this.state.signInAnonymouslyAttempt === 0) {
                        this.setState({ signInAnonymouslyAttempt: this.state.signInAnonymouslyAttempt + 1 });
                        this.props.firebase.auth.signInAnonymously();
                    }
                },
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }

    return withFirebase(withMessagesValue(WithAuthentication));
};

export default withAuthentication;