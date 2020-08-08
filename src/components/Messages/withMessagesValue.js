import React from 'react';
import MessagesContext from './context';

const withMessages = Component => {
    return (props) => {
        return (
            <MessagesContext.Consumer>
                {
                    messages => {
                        return <Component messages={messages} {...props} />
                    }
                }
            </MessagesContext.Consumer>
        );
    };
};

export default withMessages;