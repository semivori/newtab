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
                loading: true,
            };
        }

        componentDidMount() {
            this.listener = this.props.firebase.authObject.onAuthStateChanged(
                authUser => {
                    this.setState({ loading: false, authUser });
                },
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component authLoading={this.state.loading} {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }

    return withFirebase(withMessagesValue(WithAuthentication));
};

export default withAuthentication;